import { Routes, Route } from 'react-router';
import GameList from './GameList';
import Landingpage from './Landingpage';
import NoMatch from './NoMatch';

function Router() {
    return (
        <Routes>
            <Route path='/' element={<Landingpage />} />
            <Route path='games' element={<GameList />} />
            <Route path='*' element={<NoMatch />} />
        </Routes>
    );
}

export default Router;
