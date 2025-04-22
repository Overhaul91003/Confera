const STORAGE_KEY = "meeting_history";

/** 
 * @typedef {{ roomName: string,
 *             joinTime: number,        // ms since epoch
 *             leaveTime?: number,       // ms since epoch
 *             durationMs?: number      // leaveTime - joinTime
 *           }} MeetingEntry
 */

/** Push a new entry with only joinTime. */
export function addJoin(roomName) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  all.push({ roomName, joinTime: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/** Set leaveTime & duration on the last entry for this room. */
export function addLeave(roomName) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  // find last matching join without leaveTime
  for (let i = all.length - 1; i >= 0; i--) {
    const e = all[i];
    if (e.roomName === roomName && !e.leaveTime) {
      e.leaveTime = Date.now();
      e.durationMs = e.leaveTime - e.joinTime;
      break;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/** Read entries, sorted desc by joinTime, limited to `limit`. */
export function getHistory(limit = 10) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return all
    .sort((a, b) => b.joinTime - a.joinTime)
    .slice(0, limit);
}
