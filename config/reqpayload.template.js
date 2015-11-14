
/**
 *  Static ReqPayload template file
 *
 *  During development a reqPayload is needed to complete
 *  the 'authorization' step as current implementations of
 *  OAuth with the PSN network are explicit in their termination
 *  points.
 *
 *  It is intended that this file remains empty in the repository.
 *  We do not want to check-in reqPayloads in this file as they
 *  may be available to any built client.
 *
 *  USAGE:
 *    locally duplicate this file into a file named:
 *        reqpayload.local.js
 *
 *    and update the reqPayload value returned. This new file
 *    should NOT be tracked nor checked in (see .gitignore file)
 *
 */
var reqPayload = '';
module.exports = reqPayload;
