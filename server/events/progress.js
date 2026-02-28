const listeners = new Map(); // jobId -> Set(res)

export function addListener(jobId, res) {
    if (!listeners.has(jobId)) listeners.set(jobId, new Set());
    listeners.get(jobId).add(res);
}

export function removeListener(jobId, res) {
    const set = listeners.get(jobId);
    if (set) {
        set.delete(res);
        if (set.size === 0) listeners.delete(jobId);
    }
}

export function emitProgress(jobId, event, data = {}) {
    const set = listeners.get(jobId);
    if (!set) return;
    for (const res of set) {
        try {
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify({ jobId, ...data })}\n\n`);
        } catch (error) {
            console.error(`Failed to emit progress for job ${jobId}:`, error);
            removeListener(jobId, res);
        }
    }
}
