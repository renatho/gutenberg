/**
 * External dependencies
 */
import Clipboard from 'clipboard';

/**
 * WordPress dependencies
 */
import { useRef, useEffect, useState } from '@wordpress/element';
import deprecated from '@wordpress/deprecated';

/**
 * Copies the text to the clipboard when the element is clicked.
 *
 * @deprecated
 *
 * @param {Object}          ref     Reference with the element.
 * @param {string|Function} text    The text to copy.
 * @param {number}          timeout Optional timeout to reset the returned
 *                                  state. 4 seconds by default.
 *
 * @return {boolean} Whether or not the text has been copied. Resets after the
 *                   timeout.
 */
export default function useCopyOnClick( ref, text, timeout = 4000 ) {
	deprecated( 'wp.compose.useCopyOnClick', {
		alternative: 'wp.compose.useCopyToClipboard',
	} );

	const clipboard = useRef();
	const [ hasCopied, setHasCopied ] = useState( false );

	useEffect( () => {
		let timeoutId;

		// Clipboard listens to click events.
		clipboard.current = new Clipboard( ref.current, {
			text: () => ( typeof text === 'function' ? text() : text ),
		} );

		clipboard.current.on( 'success', ( { clearSelection, trigger } ) => {
			// Clearing selection will move focus back to the triggering button,
			// ensuring that it is not reset to the body, and further that it is
			// kept within the rendered node.
			clearSelection();

			// Handle ClipboardJS focus bug, see https://github.com/zenorocha/clipboard.js/issues/680
			if ( trigger ) {
				trigger.focus();
			}

			if ( timeout ) {
				setHasCopied( true );
				clearTimeout( timeoutId );
				timeoutId = setTimeout( () => setHasCopied( false ), timeout );
			}
		} );

		return () => {
			clipboard.current.destroy();
			clearTimeout( timeoutId );
		};
	}, [ text, timeout, setHasCopied ] );

	return hasCopied;
}
