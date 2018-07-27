/* @flow */

export default function throttle(delayMs: number, cb: *): * {
  let calledAtMs: number | null = null;
  return (...args: *) => {
    if (!calledAtMs) {
      calledAtMs = Date.now();
      cb(...args);
      return;
    }
    const nowMs = Date.now();
    if (nowMs - calledAtMs >= delayMs) {
      calledAtMs = nowMs;
      cb(...args);
    }
  };
}
