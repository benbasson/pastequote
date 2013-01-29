/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Paste Quote.
 *
 * The Initial Developer of the Original Code is
 *   Ben Basson <ben@basson.at>
 * Portions created by the Initial Developer are Copyright (C) 2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Ben Basson <ben@basson.at>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var pastequote = {
	init: function() {
		var menu = document.getElementById("contentAreaContextMenu");
		menu.addEventListener("popupshowing", pastequote.showHide, false);
	},
	showHide: function() {
		var pq = document.getElementById("context-pastequote");
    var p = document.getElementById("context-paste");
    pq.hidden = p.hidden;
    if (document.getElementById("cmd_paste").getAttribute("disabled") == "true") {
      pq.setAttribute("disabled", "true");
    }
    else {
      pq.removeAttribute("disabled");
    }
	},
	pasteQuote: function() {
  	var theBox = document.commandDispatcher.focusedElement;
  	if (!theBox)
  	  return false;
    var clip = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
    if (!clip)
      return false;
    
    var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    if (!trans) return false;
    trans.addDataFlavor("text/unicode");
    clip.getData(trans,clip.kGlobalClipboard);
    
    var str=new Object();
    var strLength=new Object();
    
    trans.getTransferData("text/unicode",str,strLength);

    if (str) str=str.value.QueryInterface(Components.interfaces.nsISupportsString);
    if (str) pastetext=str.data.substring(0,strLength.value / 2);
    
		var theBox = document.commandDispatcher.focusedElement;
		var oPosition = theBox.scrollTop;
		var oHeight = theBox.scrollHeight;
		pastequote.insertAtCursor(theBox,"[quote]" + str + "[/quote]");
		var nHeight = theBox.scrollHeight - oHeight;
		theBox.scrollTop = oPosition + nHeight;
		return true;
	},
	insertAtCursor: function(myField, myValue) {
  // Function taken from http://www.alexking.org/blog/2003/06/02/inserting-at-the-cursor-using-javascript/
  // Modified to return cursor to correct place
    if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos)
      + myValue
      + myField.value.substring(endPos, myField.value.length);
      var cursorPos = endPos + myValue.length;
      myField.selectionStart = cursorPos;
      myField.selectionEnd = cursorPos;
    } 
    else {
      myField.value += myValue;
    }
  }
}
window.addEventListener('load', pastequote.init, false); 
