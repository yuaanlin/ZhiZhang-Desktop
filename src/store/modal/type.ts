import {FC} from 'react';

export interface OpenedModal {
  key: string;
  isOpened: boolean;
  modal: FC<any>;
  props?: Object;
}

export interface ModalState {
  modals: OpenedModal[];
}

interface OpenModalAction {
  type: 'modal/open';
  modal: FC<any>;
  props?: Object;
}

interface CloseModalAction {
  type: 'modal/close';
  key: string;
}

interface RemoveModalAction {
  type: 'modal/remove';
  key: string;
}

export type ModalAction = OpenModalAction | RemoveModalAction | CloseModalAction
