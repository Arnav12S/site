import { eventHandler, getQuery, setHeader, sendStream } from 'h3';
import { resumeData } from '../data/resumeData'; // Ensure this path is correct
import path from 'path';
import fs from 'fs';

export default eventHandler(async (event) => {
    console.log('Handler invoked');
    
    // Debugging: Check if resumeData is imported correctly
    console.log('Imported resumeData:', resumeData);

    try {
        const parsedData = { ...resumeData };

        // Process query parameters
        const { section, photoFormat } = getQuery(event);

        // Handle photo processing using the path from resumeData.js
        try {
            const imagePath = path.join(process.cwd(), 'public', parsedData.photo.replace(/^\//, ''));

            if (!fs.existsSync(imagePath)) {
                console.warn(`Image file not found: ${imagePath}`);

                // Fallback to default image if the specified one is not found
                const defaultImagePath = path.join(process.cwd(), 'public', 'resume-profile-picture.png');
                if (fs.existsSync(defaultImagePath)) {
                    parsedData.photo = '/resume-profile-picture.png'; // Use default photo
                } else {
                    console.warn('Default image file not found either.');
                    parsedData.photo = null; // Set photo to null if default is missing
                }
            } else {
                const imageBuffer = fs.readFileSync(imagePath);

                if (photoFormat === 'raw' && (!section || section === 'photo')) {
                    setHeader(event, 'Content-Type', 'image/png');
                    return sendStream(event, fs.createReadStream(imagePath));
                }

                // Default to base64 encoding
                const base64 = imageBuffer.toString('base64');
                parsedData.photo = `data:image/png;base64,${base64}`;
            }
        } catch (photoError) {
            console.error('Error processing photo:', photoError);
            parsedData.photo = null; // Set photo to null if there's an error
        }

        // Determine which sections to include
        let responseData = { ...parsedData };
        if (section) {
            const sections = section.split(',').map(s => s.trim());

            if (sections.includes('all')) {
                // Include all sections
                responseData = { ...parsedData };
                if (!sections.includes('photo')) {
                    delete responseData.photo; // Exclude photo unless explicitly included
                }
            } else {
                // Process section queries with addition and removal
                const includeSections = [];
                const excludeSections = ['photo']; // Always exclude photo unless specified
                sections.forEach(sec => {
                    if (sec.startsWith('+')) {
                        includeSections.push(sec.slice(1).trim());
                    } else if (sec.startsWith('-')) {
                        excludeSections.push(sec.slice(1).trim());
                    } else {
                        includeSections.push(sec);
                    }
                });

                // Include specified sections
                responseData = {};
                includeSections.forEach(sec => {
                    if (parsedData[sec]) {
                        responseData[sec] = parsedData[sec];
                    }
                });

                // Exclude specified sections
                excludeSections.forEach(sec => {
                    if (responseData[sec]) {
                        delete responseData[sec];
                    }
                });
            }
        } else {
            // Default behavior: exclude photo
            delete responseData.photo;
        }

        console.log('Returning response data');
        return responseData;

    } catch (error) {
        console.error('Error:', error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ 
                error: 'Failed to process resume data', 
                details: error.message,
                stack: error.stack
            })
        };
    }
});


// This will return the entire resumeData object with all sections, including the photo. ?section=all
// This will return all sections from resumeData, but will exclude the photo. ?section=all-photo
// This will return the photo and the experience section. ?section=photo,+experience
// This will return only the education section from resumeData and exclude the experience section. ?section=+education,-experience
// This will return the resume data with the photo, education, and skills sections, and exclude the experience section. ?section=photo,+education,+skills,-experience
// This will return the photo as a PNG image stream if section is not specified or is set to 'photo'. ?photoFormat=raw
// This will return the photo encoded in base64 if section is not specified or is set to 'photo'. ?photoFormat=base64
// This will return all sections except the photo and the experience section, with the photo encoded in base64. ?section=all,-photo,-experience&photoFormat=base64