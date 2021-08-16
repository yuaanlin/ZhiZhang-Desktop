import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {RootState} from '../src/store';

export default useSelector as TypedUseSelectorHook<RootState>;
