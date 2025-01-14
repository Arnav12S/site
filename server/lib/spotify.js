const params = new URLSearchParams()

const {
	SPOTIFY_CLIENT_ID: client_id,
	SPOTIFY_CLIENT_SECRET: client_secret,
	SPOTIFY_REFRESH_TOKEN: refresh_token
} = process.env

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const PLAYER_ENDPOINT = 'https://api.spotify.com/v1/me/player'
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played'

params.append('grant_type', 'refresh_token')
params.append('refresh_token', refresh_token)

const getAccessToken = async () => {
	const response = await fetch(TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${basic}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: params.toString()
	})

	if (!response.ok) {
		throw new Error('Failed to obtain access token')
	}

	return response.json()
}

export const getCurrentPlaybackState = async () => {
	try {
		const { access_token } = await getAccessToken()
		const response = await fetch(NOW_PLAYING_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		})

		if (response.status === 204 || response.status > 400) {
			const recent = await getRecentlyPlayed()
			const recentItem = recent?.items?.[0]
			return formatRecentlyPlayed(recentItem)
		}

		const nowPlaying = await response.json()
		return formatNowPlaying(nowPlaying)
	} catch (error) {
		console.error('Error fetching playback state:', error)
		return { isPlaying: false, error: 'Unable to fetch data' }
	}
}

export const getNowPlaying = async () => {
	const { access_token } = await getAccessToken()

	return fetch(NOW_PLAYING_ENDPOINT, {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	})
}

export const getRecentlyPlayed = async () => {
	const { access_token } = await getAccessToken()
	
	const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	})

	if (!response.ok) {
		throw new Error('Failed to fetch recently played tracks')
	}

	return response.json()
}

export const controlPlayback = async (action) => {
	const { access_token } = await getAccessToken()
	
	let endpoint = PLAYER_ENDPOINT
	let method = 'PUT'

	switch (action) {
		case 'play':
			endpoint = `${PLAYER_ENDPOINT}/play`
			break
		case 'pause':
			endpoint = `${PLAYER_ENDPOINT}/pause`
			break
		case 'next':
			endpoint = `${PLAYER_ENDPOINT}/next`
			method = 'POST'
			break
		case 'previous':
			endpoint = `${PLAYER_ENDPOINT}/previous`
			method = 'POST'
			break
		default:
			throw new Error('Invalid action')
	}

	const response = await fetch(endpoint, {
		method,
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	})

	if (!response.ok) {
		throw new Error(`Failed to ${action} playback`)
	}

	return response
}

const formatNowPlaying = (data) => {
	return {
		isPlaying: data?.is_playing ?? false,
		album: data?.item?.album?.name,
		albumImageUrl: data?.item?.album?.images?.[0]?.url,
		artist: data?.item?.artists?.map(a => a.name).join(', '),
		title: data?.item?.name,
		songUrl: data?.item?.external_urls?.spotify,
		lastPlayedAt: data?.is_playing ? null : new Date().toISOString()
	}
}

const formatRecentlyPlayed = (item) => {
	if (!item) return { isPlaying: false }
	return {
		isPlaying: false,
		lastPlayedAt: new Date().toISOString(),
		album: item.track.album.name,
		albumImageUrl: item.track.album.images?.[0]?.url || '',
		artist: item.track.artists.map(a => a.name).join(', '),
		title: item.track.name,
		songUrl: item.track.external_urls.spotify
	}
}
