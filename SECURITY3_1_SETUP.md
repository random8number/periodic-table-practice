# v21.3 Security 3.1 — 30-second reconnect grace

No Firebase data or rules changes are required.

Keep the currently published Security 3 Realtime Database rules. The database room schema remains `21.3-security3`.

## Behaviour

For the first 30 seconds after another player's Firebase presence drops:
- badge: **Reconnecting**
- status: countdown to pause
- no full game pause is applied

If the player returns within 30 seconds, they go straight back to **Online**.

If they are still disconnected after 30 seconds:
- badge: **Offline**
- game: **Paused**
- moves remain blocked until they reconnect

If the browser you are actively using loses its own Firebase connection, that browser blocks its own controls immediately because it cannot safely submit moves.

## Test

Run `START_LOCAL_TEST.bat`.

PC: `http://localhost:8128`
Phone: `http://YOUR-PC-IP:8128`

### Short phone lock
Lock/background the phone for about 5–10 seconds. The PC should show **Reconnecting**, not **Paused**. Return before 30 seconds and it should go directly back to **Online**.

### Long disconnect
Turn phone Wi-Fi off for more than 30 seconds. It should count down, then change to **Offline / Paused**. Reconnect and the existing room should resume.
