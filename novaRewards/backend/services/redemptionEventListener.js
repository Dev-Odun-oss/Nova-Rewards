const appEvents = require('./eventEmitter');
const { sendRedemptionConfirmation } = require('./emailService');
const { emitBalanceUpdate } = require('./socketService');

/**
 * Registers the listener that sends a redemption confirmation email
 * and pushes a real-time balance_update whenever a 'redemption.created' event fires.
 *
 * Called once at server startup (server.js).
 * Fire-and-forget: failures are logged but never bubble up to the caller.
 */
function registerRedemptionEventListener() {
  appEvents.on('redemption.created', async ({ redemption, user, reward }) => {
    // Push real-time balance update to the user's socket room
    if (user?.id !== undefined && redemption?.new_balance !== undefined) {
      emitBalanceUpdate(user.id, { balance: redemption.new_balance });
    }

    const recipientEmail = user?.email;
    if (!recipientEmail) return;

    try {
      await sendRedemptionConfirmation({
        to: recipientEmail,
        userName: user.first_name || user.wallet_address,
        rewardName: reward.name,
        pointsSpent: redemption.points_spent,
        redemptionId: redemption.id,
      });
    } catch (err) {
      console.error('[redemptionEventListener] email send failed:', err.message);
    }
  });
}

module.exports = { registerRedemptionEventListener };
