import { PropsWithChildren } from 'react';
import ArrowLeft from '../../icons/ArrowLeft';

type ModalProps = {
  onClose: any;
  title: string;
};

function Modal({ onClose, title, children }: PropsWithChildren<ModalProps>) {
  return (
    <div
      className="modal"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <div className="modal-header">
        <button
          className="close round large"
          onClick={() => {
            onClose(false);
          }}
        >
          <ArrowLeft />
        </button>
        <h2>{title}</h2>
      </div>
      <div className="modal-content">
        <div className="modal-content-inner">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
