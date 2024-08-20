import type { ActiveHeadEntry, HeadEntryOptions } from './head'
import type { Script } from './schema'

export type UseScriptStatus = 'awaitingLoad' | 'loading' | 'loaded' | 'error' | 'removed'

/**
 * Either a string source for the script or full script properties.
 */
export type UseScriptInput = string | (Omit<Script, 'src'> & { src: string })
export type UseScriptResolvedInput = Omit<Script, 'src'> & { src: string }
type BaseScriptApi = Record<symbol | string, any>

export type AsAsyncFunctionValues<T extends BaseScriptApi> = {
  [key in keyof T]:
  // arays return literals
  T[key] extends any[] ? T[key] :
    T[key] extends object ? AsAsyncFunctionValues<T[key]> :
      T[key] extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : () => Promise<T[key]>
}

export interface ScriptInstance<T extends BaseScriptApi> {
  proxy: AsAsyncFunctionValues<T>
  instance?: T
  id: string
  status: UseScriptStatus
  entry?: ActiveHeadEntry<any>
  load: () => Promise<T>
  remove: () => boolean
  // cbs
  onLoaded: (fn: (instance: T) => void | Promise<void>) => void
  onError: (fn: (err?: Error) => void | Promise<void>) => void
  /**
   * @internal
   */
  _cbs: {
    loaded: ((instance: T) => void | Promise<void>)[]
    error: ((err?: Error) => void | Promise<void>)[]
  }
}

export interface UseScriptOptions<T extends BaseScriptApi> extends HeadEntryOptions {
  /**
   * Resolve the script instance from the window.
   */
  use?: () => T | undefined | null
  /**
   * Stub the script instance. Useful for SSR or testing.
   */
  stub?: ((ctx: { script: ScriptInstance<T>, fn: string | symbol }) => any)
  /**
   * The trigger to load the script:
   * - `undefined` | `client` - (Default) Load the script on the client when this js is loaded.
   * - `manual` - Load the script manually by calling `$script.load()`, exists only on the client.
   * - `Promise` - Load the script when the promise resolves, exists only on the client.
   * - `Function` - Register a callback function to load the script, exists only on the client.
   * - `server` - Have the script injected on the server.
   */
  trigger?: 'client' | 'server' | 'manual' | Promise<void> | ((fn: any) => any) | null
  /**
   * Context to run events with. This is useful in Vue to attach the current instance context before
   * calling the event, allowing the event to be reactive.
   */
  eventContext?: any
  /**
   * Called before the script is initialized. Will not be triggered when the script is already loaded. This means
   * this is guaranteed to be called only once, unless the script is removed and re-added.
   */
  beforeInit?: () => void
}
