import { Routes, Route } from 'react-router';
import GameList from './GameList';
import Game from './Game';
import NoMatch from './NoMatch';

function Router() {
    return (
        <Routes>
            <Route path='/' element={<GameList />} />
            <Route path=':gameId' element={<Game />} />
            <Route path='*' element={<NoMatch />} />
        </Routes>
    );
}

export default Router;
