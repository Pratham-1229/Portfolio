export type Event = {
  name: string
  properties?: Record<string, unknown>
}

export function trackEvent(...args: unknown[]) {
  void args
}
