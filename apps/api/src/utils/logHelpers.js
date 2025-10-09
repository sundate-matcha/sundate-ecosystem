/**
 * Log Query Helper Utilities
 * Helper functions for filtering, searching, and analyzing logs
 */

/**
 * Build query object for log filtering
 * @param {Object} filters - Filter parameters
 * @returns {Object} MongoDB query object
 */
export const buildLogQuery = (filters = {}) => {
  const query = {}

  // Filter by action
  if (filters.action) {
    if (Array.isArray(filters.action)) {
      query.action = { $in: filters.action }
    } else {
      query.action = filters.action
    }
  }

  // Filter by reservation ID
  if (filters.reservationId) {
    query.reservationId = filters.reservationId
  }

  // Filter by notification status
  if (filters.notificationStatus) {
    query.notificationStatus = filters.notificationStatus
  }

  // Filter by status
  if (filters.newStatus) {
    query.newStatus = filters.newStatus
  }

  // Filter by user ID
  if (filters.userId) {
    query['metadata.userId'] = filters.userId
  }

  // Filter by source
  if (filters.source) {
    query['metadata.source'] = filters.source
  }

  // Filter by date range
  if (filters.startDate || filters.endDate) {
    query.createdAt = {}
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate)
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate)
    }
  }

  return query
}

/**
 * Build sort options for log queries
 * @param {String} sortBy - Field to sort by
 * @param {String} sortOrder - Sort order (asc/desc)
 * @returns {Object} MongoDB sort object
 */
export const buildLogSortOptions = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const validFields = ['createdAt', 'action', 'reservationId', 'notificationStatus']
  const field = validFields.includes(sortBy) ? sortBy : 'createdAt'
  const order = sortOrder === 'asc' ? 1 : -1

  return { [field]: order }
}

/**
 * Format log entry for display
 * @param {Object} log - Log entry
 * @returns {Object} Formatted log entry
 */
export const formatLogEntry = (log) => {
  return {
    id: log._id,
    reservationId: log.reservationId,
    action: log.action,
    previousStatus: log.previousStatus,
    newStatus: log.newStatus,
    changes: log.changes,
    details: log.details,
    notificationSent: log.notificationSent,
    notificationStatus: log.notificationStatus,
    timestamp: log.createdAt,
    formattedTimestamp: log.formattedTimestamp,
    metadata: log.metadata
  }
}

/**
 * Group logs by action
 * @param {Array} logs - Array of log entries
 * @returns {Object} Logs grouped by action
 */
export const groupLogsByAction = (logs) => {
  return logs.reduce((groups, log) => {
    const action = log.action
    if (!groups[action]) {
      groups[action] = []
    }
    groups[action].push(log)
    return groups
  }, {})
}

/**
 * Group logs by date
 * @param {Array} logs - Array of log entries
 * @returns {Object} Logs grouped by date
 */
export const groupLogsByDate = (logs) => {
  return logs.reduce((groups, log) => {
    const date = new Date(log.createdAt).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(log)
    return groups
  }, {})
}

/**
 * Calculate log statistics
 * @param {Array} logs - Array of log entries
 * @returns {Object} Log statistics
 */
export const calculateLogStats = (logs) => {
  const stats = {
    total: logs.length,
    byAction: {},
    byStatus: {},
    notificationStats: {
      sent: 0,
      failed: 0,
      pending: 0
    }
  }

  logs.forEach(log => {
    // Count by action
    if (!stats.byAction[log.action]) {
      stats.byAction[log.action] = 0
    }
    stats.byAction[log.action]++

    // Count by status
    if (log.newStatus) {
      if (!stats.byStatus[log.newStatus]) {
        stats.byStatus[log.newStatus] = 0
      }
      stats.byStatus[log.newStatus]++
    }

    // Count notification stats
    if (log.notificationStatus === 'sent') {
      stats.notificationStats.sent++
    } else if (log.notificationStatus === 'failed') {
      stats.notificationStats.failed++
    } else if (log.notificationStatus === 'pending') {
      stats.notificationStats.pending++
    }
  })

  return stats
}

/**
 * Get action icon/emoji
 * @param {String} action - Action type
 * @returns {String} Icon/emoji for action
 */
export const getActionIcon = (action) => {
  const icons = {
    created: '➕',
    updated: '✏️',
    confirmed: '✅',
    cancelled: '❌',
    deleted: '🗑️',
    status_changed: '🔄'
  }

  return icons[action] || '📝'
}

/**
 * Get action color for UI display
 * @param {String} action - Action type
 * @returns {String} Color code
 */
export const getActionColor = (action) => {
  const colors = {
    created: '#4CAF50',
    updated: '#2196F3',
    confirmed: '#8BC34A',
    cancelled: '#F44336',
    deleted: '#9E9E9E',
    status_changed: '#FF9800'
  }

  return colors[action] || '#757575'
}

/**
 * Format changes object for display
 * @param {Object} changes - Changes object
 * @returns {String} Formatted changes string
 */
export const formatChanges = (changes) => {
  if (!changes || Object.keys(changes).length === 0) {
    return 'No changes'
  }

  return Object.entries(changes)
    .map(([field, change]) => {
      if (change.old && change.new) {
        return `${field}: ${change.old} → ${change.new}`
      }
      return `${field}: ${change}`
    })
    .join(', ')
}

/**
 * Search logs by text
 * @param {Array} logs - Array of log entries
 * @param {String} searchText - Search text
 * @returns {Array} Filtered logs
 */
export const searchLogs = (logs, searchText) => {
  if (!searchText || searchText.trim() === '') {
    return logs
  }

  const searchLower = searchText.toLowerCase()

  return logs.filter(log => {
    // Search in details
    if (log.details && log.details.toLowerCase().includes(searchLower)) {
      return true
    }

    // Search in action
    if (log.action && log.action.toLowerCase().includes(searchLower)) {
      return true
    }

    // Search in status
    if (log.newStatus && log.newStatus.toLowerCase().includes(searchLower)) {
      return true
    }

    // Search in changes
    if (log.changes) {
      const changesStr = JSON.stringify(log.changes).toLowerCase()
      if (changesStr.includes(searchLower)) {
        return true
      }
    }

    return false
  })
}

/**
 * Get time range description
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {String} Time range description
 */
export const getTimeRangeDescription = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return 'All time'
  }

  const start = startDate ? new Date(startDate).toLocaleDateString() : 'Beginning'
  const end = endDate ? new Date(endDate).toLocaleDateString() : 'Now'

  return `${start} - ${end}`
}

/**
 * Check if log is recent (within last hour)
 * @param {Object} log - Log entry
 * @returns {Boolean} Whether log is recent
 */
export const isRecentLog = (log) => {
  const oneHourAgo = new Date()
  oneHourAgo.setHours(oneHourAgo.getHours() - 1)
  return new Date(log.createdAt) > oneHourAgo
}

/**
 * Get relative time description
 * @param {Date} date - Date to compare
 * @returns {String} Relative time description
 */
export const getRelativeTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return 'Just now'
  } else if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return new Date(date).toLocaleDateString()
  }
}

export default {
  buildLogQuery,
  buildLogSortOptions,
  formatLogEntry,
  groupLogsByAction,
  groupLogsByDate,
  calculateLogStats,
  getActionIcon,
  getActionColor,
  formatChanges,
  searchLogs,
  getTimeRangeDescription,
  isRecentLog,
  getRelativeTime
}
