import React from "react";
import './SideDrawer.css';
import ReactDOM from "react-dom"

const SideDrawer = props => {

    let content = 
        <aside className="side-drawer" id = {props.id}>
            <button type="button" className="btn-close" aria-label="Close" onClick = {props.onClick}></button>
            {props.children}       
        </aside>
    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
}

export default SideDrawer;