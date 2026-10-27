// React Three Fiber 8 registers its tags on the global JSX namespace; the React 19
// type definitions read them from React.JSX instead. This points one at the other.
import type { ThreeElements } from '@react-three/fiber'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements extends ThreeElements {}
  }
}
