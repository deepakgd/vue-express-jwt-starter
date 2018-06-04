const request = require('request-promise')
const broadcast = {
  callUrl: 'https://graph.facebook.com/v2.11'
}
const logger = require('../lib/logger')

function logApiError(error) {
  try {
    error = JSON.parse(error.error)
    logger.general.error(error)
  } catch (e) {
    logger.general.info('Error while parsing API error in broadcast utils')
    logger.general.error(e)
  }
}

// add template message
const addTemplate = (pageToken, template) => {
  return request.post({
    url: `${broadcast.callUrl}/me/message_creatives?access_token=${pageToken}`,
    form: template
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    logApiError(err)
    throw err
  })
}

// create new label
const addLabel = (name, pageToken) => {
  return request.post({
    url: `${broadcast.callUrl}/me/custom_labels?access_token=${pageToken}`,
    form: { 'name': name }
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    logApiError(err)
    throw err
  })
}

// add the user in label
const addUserInLabel = (labelId, psId, pageToken) => {
  return request.post({
    url: `${broadcast.callUrl}/${labelId}/label?access_token=${pageToken}`,
    form: { 'user': psId }
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    // logApiError(err)
    return Promise.reject(err)
  })
}

// Get users in a label
const getLabelDetail = (labelId, pageToken) => {
  return request.get({
    url: `${broadcast.callUrl}/${labelId}?fields=name&access_token=${pageToken}`
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    logApiError(err)
    throw err
  })
}

// Get users in a label
const getAllLabels = (pageToken) => {
  return request.get({
    url: `${broadcast.callUrl}/me/custom_labels?fields=name&access_token=${pageToken}&limit=30`
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    logApiError(err)
    throw err
  })
}

// delete the user in label
const deleteUserInLabel = (labelId, psId, pageToken) => {
  return request.delete({
    url: `${broadcast.callUrl}/${labelId}/label?access_token=${pageToken}`,
    form: { 'user': psId }
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    logApiError(err)
    throw err
  })
}

// delete a label
const deleteLabel = (labelId, pageToken) => {
  return request.delete({
    url: `${broadcast.callUrl}/${labelId}?access_token=${pageToken}`
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    logApiError(err)
    throw err
  })
}

// send message for specific label
const sendBroadCastMessage = (messageCreativeId, labelId, pageToken) => {
  return request.post({
    url: `${broadcast.callUrl}/me/broadcast_messages?access_token=${pageToken}`,
    form: {
      'message_creative_id': messageCreativeId,
      'custom_label_id': labelId
    }
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    logApiError(err)
    throw err
  })
}

/**
 * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/estimate-reach/#start
 * @param {*} pageToken
 * @param {*} labelId
 */
const startReachEstimation = (pageToken, labelId) => {
  return request.post({
    url: `${broadcast.callUrl}/me/broadcast_reach_estimations?access_token=${pageToken}`,
    form: {
      'custom_label_id': labelId
    }
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    throw err
  })
}

/**
 * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/estimate-reach/#get
 * @param {*} pageToken
 * @param {*} labelId
 */
const retrieveReachEstimation = (pageToken, reachEstimationId) => {
  return request.get({
    url: `${broadcast.callUrl}/${reachEstimationId}?access_token=${pageToken}`
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    throw err
  })
}

/**
 * https://developers.facebook.com/docs/messenger-platform/send-messages/broadcast-messages/estimate-reach/#get
 * @param {*} pageToken
 * @param {*} labelId
 */
const metrics = (pageToken, broadcastId) => {
  return request.get({
    url: `${broadcast.callUrl}/${broadcastId}/insights/messages_sent?access_token=${pageToken}`
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    throw err
  })
}

const addAttachment = (url, type, pageToken) => {
  return request.post({
    url: `${broadcast.callUrl}/me/message_attachments?access_token=${pageToken}`,
    form: {
      'message': {
        'attachment': {
          'type': type,
          'payload': {
            'is_reusable': true,
            'url': url
          }
        }
      }
    }
  }).then(function (response) {
    return response ? JSON.parse(response) : null
  }).catch(err => {
    throw err
  })
}

module.exports = {
  addAttachment: addAttachment,
  addTemplate: addTemplate,
  addLabel: addLabel,
  addUserInLabel: addUserInLabel,
  getLabelDetail: getLabelDetail,
  getAllLabels: getAllLabels,
  deleteUserInLabel: deleteUserInLabel,
  deleteLabel: deleteLabel,
  sendBroadCastMessage: sendBroadCastMessage,
  startReachEstimation: startReachEstimation,
  retrieveReachEstimation: retrieveReachEstimation,
  metrics: metrics
}
