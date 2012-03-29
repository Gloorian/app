/*
Copyright 2005 Collin Jackson

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of Stanford University nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * Hashed Password
 * Combination of page URI and plaintext password.
 * Treated as a string, it is the hashed password.
 */

function SPH_HashedPassword(password, realm) {
  var hashedPassword = this._getHashedPassword(password, realm);
  this.toString = function() { return hashedPassword; }
}

var SPH_kPasswordPrefix = "@@";

SPH_HashedPassword.prototype = {

  /**
   * Determine the hashed password from the salt and the master password
   */
  _getHashedPassword: function(password, realm) {
    var hash = b64_hmac_md5(password, realm);
    var size = password.length + SPH_kPasswordPrefix.length;
    var nonalphanumeric = password.match(/\W/) != null;
    var result = this._applyConstraints(hash, size, nonalphanumeric);
    return result;
  },

  /**
   * Fiddle with the password a bit after hashing it so that it will get through
   * most website filters. We require one upper and lower case, one digit, and
   * we look at the user's password to determine if there should be at least one 
   * alphanumeric or not.
   */
  _applyConstraints: function(hash, size, nonalphanumeric) {
    var startingSize = size - 4;  // Leave room for some extra characters
    var result = hash.substring(0, startingSize);
    var extras = hash.substring(startingSize).split('');

    // Some utility functions to keep things tidy
    function nextExtra() { return extras.length ? extras.shift().charCodeAt(0) : 0; }
    function nextExtraChar() { return String.fromCharCode(nextExtra()); }
    function rotate(arr, amount) { while(amount--) arr.push(arr.shift()) }
    function between(min, interval, offset) { return min + offset % interval; }
    function nextBetween(base, interval) { 
      return String.fromCharCode(between(base.charCodeAt(0), interval, nextExtra()));
    }
    function contains(regex) { return result.match(regex); }

    // Add the extra characters
    result += (contains(/[A-Z]/) ? nextExtraChar() : nextBetween('A', 26));
    result += (contains(/[a-z]/) ? nextExtraChar() : nextBetween('a', 26));
    result += (contains(/[0-9]/) ? nextExtraChar() : nextBetween('0', 10));
    result += (contains(/\W/) && nonalphanumeric ? nextExtraChar() : '+');
    while (contains(/\W/) && !nonalphanumeric) {
      result = result.replace(/\W/, nextBetween('A', 26));
    }

    // Rotate the result to make it harder to guess the inserted locations
    result = result.split('');
    rotate(result, nextExtra());
    return result.join('');
  }
}

