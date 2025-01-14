import { defineWebSocketHandler } from 'h3'
import { getCurrentPlaybackState, controlPlayback } from '../lib/spotify'

const SPOTIFY_ROOM = 'spotify_room'
const POLLING_INTERVAL = 3000 // Reduced polling interval for better responsiveness
let lastPlayedTime = null

let lastKnownState = null
let pollingIntervalId = null
const connectedPeers = new Set()

const broadcastToRoom = (state) => {
	for (const peer of connectedPeers) {
		try {
			peer.send(JSON.stringify({
				type: 'spotify_update',
				data: state
			}))
		} catch (error) {
			console.error('Error broadcasting to peer:', error)
		}
	}
}

const startPolling = () => {
	if (pollingIntervalId) return

	const poll = async () => {
		try {
			const currentState = await getCurrentPlaybackState()
			
			if (!currentState.isPlaying && lastPlayedTime) {
				currentState.lastPlayedAt = lastPlayedTime.toISOString()
			}
			
			if (stateHasChanged(currentState, lastKnownState)) {
				lastKnownState = currentState
				broadcastToRoom(currentState)
			}
		} catch (error) {
			console.error('Error polling playback state:', error)
		}
	}

	poll()
	
	pollingIntervalId = setInterval(poll, POLLING_INTERVAL)
}

const stateHasChanged = (newState, oldState) => {
	if (!oldState || !newState) return true
	
	if (oldState.isPlaying && !newState.isPlaying) {
		lastPlayedTime = new Date()
		newState.lastPlayedAt = lastPlayedTime.toISOString()
	}
	
	const relevantFields = ['isPlaying', 'title', 'artist', 'albumImageUrl']
	return relevantFields.some(field => newState[field] !== oldState[field])
}

export default defineWebSocketHandler({
	open(peer) {
		console.log('New WebSocket connection:', peer.id)
		connectedPeers.add(peer)
		peer.subscribe(SPOTIFY_ROOM)

		// Send the last known state immediately upon connection
		if (lastKnownState) {
				peer.publish(SPOTIFY_ROOM, JSON.stringify({
					type: 'spotify_update',
					data: lastKnownState
				}))
		}

		// Start polling if not already started
		startPolling()
	},

	close(peer) {
		console.log('WebSocket connection closed:', peer.id)
		connectedPeers.delete(peer)
		
		// Stop polling if no more clients
		if (connectedPeers.size === 0) {
			clearInterval(pollingIntervalId)
			pollingIntervalId = null
		}
	},

	async message(peer, message) {
		try {
			const parsed = JSON.parse(message.text())

			if (parsed.type === 'playback_control' && parsed.action) {
				await controlPlayback(parsed.action)
				// The polling mechanism will handle broadcasting the new state
			}
		} catch (err) {
			console.error('WebSocket message error:', err)
		}
	},

	error(peer, error) {
		console.error('WebSocket error:', error)
		// Attempt cleanup
		connectedPeers.delete(peer)
	}
})

function getAllPeers() {
	return Array.from(connectedPeers)
}

