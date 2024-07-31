// eslint-disable-next-line @typescript-eslint/no-unused-vars
import './app.scss';

import { Game } from '../components/game';
import { AnimationProvider } from '../contexts/animation';

export function App() {
  return (
    <AnimationProvider>
      <Game />
    </AnimationProvider>
  );
}

export default App;
