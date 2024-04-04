import React, {ReactNode, useState} from 'react';
import {Modal, Text} from "@geist-ui/core";
import {QuestionCircle} from "@geist-ui/icons";

interface NiceTooltipProps {
    children: ReactNode;
}

const NiceTooltip: React.FC<NiceTooltipProps> = ({ children, ...props }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <QuestionCircle size={16} onClick={() => setShowModal(true)} />
            <Modal scale={0.9} visible={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content>
                    { children }
                </Modal.Content>
                <Modal.Action onClick={() => setShowModal(false)}>Okay</Modal.Action>
            </Modal>
        </>
    )
}

export default NiceTooltip;
