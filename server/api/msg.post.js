import { setHeader, readBody } from 'h3'

export default defineEventHandler(async (event) => {
	// Set CORS headers
	setHeader(event, 'Access-Control-Allow-Origin', '*')
	setHeader(event, 'Access-Control-Allow-Methods', 'POST')
	setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

	const body = await readBody(event)

	if (!body) {
		console.warn('No body in the request.')
		return { message: 'Only POST requests with body are accepted.', error: true }
	}

	const { name, email, message } = body
	console.log('Received form data:', { name, email, message })

	// Validate environment variables
	if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
		console.error('Missing Mailjet credentials')
		return { 
			message: 'Server configuration error', 
			error: true 
		}
	}

	const mailjetUrl = 'https://api.mailjet.com/v3.1/send'
	const auth = Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_API_SECRET}`).toString('base64')

	const emailData = {
		Messages: [
			{
				From: {
					Email: "noreply@arnav.blog",
					Name: "Website Contact Form"
				},
				To: [
					{
						Email: "hi@arnav.blog",
						Name: "Arnav"
					}
				],
				Subject: `${name} sent you a message via website`,
				TextPart: `${name} (${email}) sent you this message:\n\n${message}`,
				HTMLPart: `<strong>${name}</strong> sent you this message:<br/><br/>${message.replace(/\n/g, '<br/>')}<br/><br/>Reply directly to <strong>${name}</strong> at <a href="mailto:${email}">${email}</a>`,
				Headers: {
					"Reply-To": `${name} <${email}>`
				}
			}
		]
	}

	try {
		const response = await $fetch(mailjetUrl, {
			method: 'POST',
			body: emailData,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Basic ${auth}`
			}
		})

		console.log('Email sent successfully:', response)
		return { success: true, message: 'Message sent successfully', error: false }
	} catch (error) {
		console.error('Failed to send email:', error.data || error.message)
		return { 
			message: `Failed to send message: ${error.data?.Message || error.message}`, 
			error: true 
		}
	}
})