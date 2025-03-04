const env = require("../env")
const pushover = require('pushover-notifications')

const pushUser = env.PUSH_USER
const pushToken = env.PUSH_TOKEN

const pushMessage = new pushover( {
  user: pushUser,
  token: pushToken,
})

if (env.USE_PUSHOVER) {

  const testMsg = {
    // 'message' is required. All other values are optional.
        message: "Binance Robot Restarted",
        title: "Binance Robot Restarted",
        sound: 'cashregister',
        device: 'devicename',
        priority: 0,
        html: 1
  }

  // pushMessage
  //   .send(testMsg)
  //   .then(() => {
  //     console.log('Message sent.');
  //   })
  //   .catch(error => {
  //     console.log('An error occurred.');
  //     console.log(error);
  //   });
  pushMessage.send( testMsg, function( err, result ) {
    if ( err ) {
        throw err
    }
    console.log( result )
  })
};

function createSignalMessage(base, signal) {
  let msg = base + " :: " + signal.stratname + ' ' + signal.pair + ' ' + signal.price + "\n"
  msg += (signal.score ? "score: " + signal.score : 'score: NA') + "\n"
  return msg
}

module.exports = function () {
  if (!env.USE_PUSHOVER) return {};

  function send(message) {
    if (!env.USE_PUSHOVER) return;

    const pushMsg = {
      // 'message' is required. All other values are optional.
          message: message,
          title: "Binance Robot",
          sound: 'cashregister',
          device: 'devicename',
          priority: 0,
          html: 1
      }

    pushMessage.send( pushMsg, function( err, result ) {
      if ( err ) {
          throw err
      }
      // console.log( result )
    })
  }

  function notifyBuyToCoverSignal(signal) {
    return send(createSignalMessage("<i>BUY_SIGNAL :: BUY TO COVER SHORT TRADE</i>", signal));
  }
  function notifyBuyToCoverTraded(signal) {
    return send(createSignalMessage("<b>>> SUCCESS! BUY_SIGNAL :: BUY TO COVER SHORT TRADE</b>", signal));
  }
  function notifyEnterLongSignal(signal) {
    return send(createSignalMessage("<i>BUY_SIGNAL :: ENTER LONG TRADE</i>", signal));
  }
  function notifyEnterLongTraded(signal) {
    return send(createSignalMessage("<b>>> SUCCESS! BUY_SIGNAL :: ENTER LONG TRADE</b>", signal));
  }
  function notifyEnterShortSignal(signal) {
    return send(createSignalMessage("<i>SEL_SIGNAL :: ENTER SHORT TRADE</i>", signal));
  }
  function notifyEnterShortTraded(signal) {
    return send(createSignalMessage("<b>>> SUCCESS! SELL_SIGNAL :: ENTER SHORT TRADE</b>", signal));
  }
  function notifyExitLongSignal(signal) {
    return send(createSignalMessage("<i>SELL_SIGNAL :: SELL TO EXIT LONG TRADE</i>", signal));
  }
  function notifyExitLongTraded(signal) {
    return send(createSignalMessage("<b>>> SUCCESS! SELL_SIGNAL :: SELL TO EXIT LONG TRADE</b>", signal));
  }

  return {
    notifyBuyToCoverSignal,
    notifyBuyToCoverTraded,
    notifyEnterLongSignal,
    notifyEnterLongTraded,
    notifyEnterShortSignal,
    notifyEnterShortTraded,
    notifyExitLongSignal,
    notifyExitLongTraded,
    send,
  }
}

