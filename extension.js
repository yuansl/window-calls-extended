/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

// Created: 2022-04-05T09:02:24+02:00 by Hendrik G. Seliger (github@hseliger.eu)
// Last changes: 2023-11-13T22:28:33+01:00 by Hendrik G. Seliger (github@hseliger.eu)

// Based on the initial version by ickyicky (https://github.com/ickyicky),
// extended by a few methods to provide the focused window's title, window class, and pid.

// Updated to use ECMA Script Module (ESM) for Gnome 45
// See: https://gjs.guide/extensions/upgrading/gnome-shell-45.html

/* exported init */

import Gio from 'gi://Gio';
import Mtk from 'gi://Mtk';
const MR_DBUS_IFACE = `
<node>
    <interface name="org.gnome.Shell.Extensions.WindowsExt">
        <method name="List">
            <arg type="s" direction="out" name="win"/>
        </method>
        <method name="FocusTitle">
            <arg type="s" direction="out" />
        </method>
        <method name="FocusPID">
            <arg type="s" direction="out" />
        </method>
        <method name="FocusID">
            <arg type="s" direction="out" />
        </method>
        <method name="FocusClass">
            <arg type="s" direction="out" />
        </method>

        <method name="RaiseEmacsWindow">
            <arg type="s" direction="out" />
        </method>

    </interface>
</node>`;

export default class WCExtension {
    enable() {
        this._dbus = Gio.DBusExportedObject.wrapJSObject(MR_DBUS_IFACE, this);
        this._dbus.export(Gio.DBus.session, '/org/gnome/Shell/Extensions/WindowsExt');
    }

    disable() {
        this._dbus.flush();
        this._dbus.unexport();
        delete this._dbus;
    }
    List() {
        let win = global.get_window_actors()
            .map(a => a.meta_window)
            .map(w => ({ class: w.get_wm_class(), pid: w.get_pid(), id: w.get_id(), maximized: w.get_maximized(), focus: w.has_focus(), title: w.get_title() }));
        return JSON.stringify(win);
    }
    FocusTitle() {
        let win = global.get_window_actors()
            .map(a => a.meta_window)
            .map(w => ({ focus: w.has_focus(), title: w.get_title() }));
        for (let [_ignore, aWindow] of win.entries()) {
            let [focus, theTitle] = Object.entries(aWindow);
            if (focus[1] == true)
                return theTitle[1];
        }
        return "";
    }
    FocusPID() {
        let win = global.get_window_actors()
            .map(a => a.meta_window)
            .map(w => ({ focus: w.has_focus(), pid: w.get_pid() }));
        for (let [_ignore, aWindow] of win.entries()) {
            let [focus, thePID] = Object.entries(aWindow);
            if (focus[1] == true)
                return "" + thePID[1]; // Turn number into string
        }
        return "";
    }
    FocusID() {
        let win = global.get_window_actors()
            .map(a => a.meta_window)
            .map(w => ({ focus: w.has_focus(), id: w.get_id() }));
        for (let [_ignore, aWindow] of win.entries()) {
            let [focus, theID] = Object.entries(aWindow);
            if (focus[1] == true)
                return "" + theID[1]; // Turn number into string
        }
        return "";
    }
    FocusClass() {
        let win = global.get_window_actors()
            .map(a => a.meta_window)
            .map(w => ({ focus: w.has_focus(), class: w.get_wm_class() }));
        for (let [_ignore, aWindow] of win.entries()) {
            let [focus, theClass] = Object.entries(aWindow);
            if (focus[1] == true)
                return theClass[1];
        }
        return "";
    }

    _raise_window(window) {
        const activeWorkspace = global.workspaceManager.get_active_workspace();
        window.change_workspace(activeWorkspace);
        window.get_workspace().activate_with_focus(window, true)
        window.activate(0)
        const win_rect = window.get_frame_rect()
        const [x, y] = global.get_pointer()
        const pointer_rect = new Mtk.Rectangle({ x, y, width: 1, height: 1 })
        if (!pointer_rect.intersect(win_rect)[0]) {
            const { x, y, width, height } = win_rect
            this._seat.warp_pointer(x + width / 2, y + height / 2)
        }
    }

    RaiseEmacsWindow() {
	let win = global.get_window_actors()
            .map(a => a.meta_window)
            .filter(w => w.get_wm_class() === 'emacs');
        for (let [_ignore , window] of win.entries()) {
	    this._raise_window(window);
	}
	return "";
    }
}
