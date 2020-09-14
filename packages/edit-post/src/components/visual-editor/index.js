/**
 * WordPress dependencies
 */
import {
	PostTitle,
	VisualEditorGlobalKeyboardShortcuts,
} from '@wordpress/editor';
import {
	WritingFlow,
	Typewriter,
	ObserveTyping,
	BlockList,
	CopyHandler,
	BlockSelectionClearer,
	MultiSelectScrollIntoView,
	__experimentalBlockSettingsMenuFirstItem,
} from '@wordpress/block-editor';
import { Popover, DropZoneProvider } from '@wordpress/components';
import { useState, useEffect, createPortal } from '@wordpress/element';
import { useKeyboardShortcut } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockInspectorButton from './block-inspector-button';
import { useResizeCanvas } from '../resize-canvas';
import EditPostKeyboardShortcuts from '../keyboard-shortcuts';

export const IFrame = ( { children, head, styles, ...props } ) => {
	const [ contentRef, setContentRef ] = useState();
	const win = contentRef && contentRef.contentWindow;
	const doc = contentRef && contentRef.contentWindow.document;

	useEffect( () => {
		if ( doc ) {
			doc.body.className = 'editor-styles-wrapper';
			doc.body.style.margin = '0px';
			doc.head.innerHTML = head;
			doc.dir = document.dir;

			styles.forEach( ( { css } ) => {
				const styleEl = doc.createElement( 'style' );
				styleEl.innerHTML = css;
				doc.head.appendChild( styleEl );
			} );

			[ ...document.styleSheets ].reduce( ( acc, styleSheet ) => {
				try {
					const isMatch = [ ...styleSheet.cssRules ].find(
						( { selectorText } ) => {
							return (
								selectorText.indexOf(
									'.editor-styles-wrapper'
								) !== -1
							);
						}
					);

					if ( isMatch ) {
						const node = styleSheet.ownerNode;

						if ( ! doc.getElementById( node.id ) ) {
							doc.head.appendChild( node );
						}
					}
				} catch ( e ) {}

				return acc;
			}, [] );
		}
	}, [ doc ] );

	return (
		<iframe
			{ ...props }
			ref={ setContentRef }
			title={ __( 'Editor content' ) }
			name="editor-content"
		>
			<useKeyboardShortcut.WindowContext.Provider value={ win }>
				{ doc && createPortal( children, doc.body ) }
			</useKeyboardShortcut.WindowContext.Provider>
		</iframe>
	);
};

function VisualEditor( { settings } ) {
	const inlineStyles = useResizeCanvas();

	return (
		<>
			<VisualEditorGlobalKeyboardShortcuts />
			<Popover.Slot name="block-toolbar" />
			<IFrame
				className="edit-post-visual-editor"
				style={ inlineStyles }
				head={ window.__editorStyles.html }
				styles={ settings.styles }
			>
				<BlockSelectionClearer>
					<DropZoneProvider>
						<VisualEditorGlobalKeyboardShortcuts />
						<EditPostKeyboardShortcuts />
						<MultiSelectScrollIntoView />
						<Typewriter>
							<CopyHandler>
								<WritingFlow>
									<ObserveTyping>
										<CopyHandler>
											<div className="edit-post-visual-editor__post-title-wrapper">
												<PostTitle />
											</div>
											<BlockList />
										</CopyHandler>
									</ObserveTyping>
								</WritingFlow>
							</CopyHandler>
						</Typewriter>
						<__experimentalBlockSettingsMenuFirstItem>
							{ ( { onClose } ) => (
								<BlockInspectorButton onClick={ onClose } />
							) }
						</__experimentalBlockSettingsMenuFirstItem>
					</DropZoneProvider>
				</BlockSelectionClearer>
			</IFrame>
		</>
	);
}

export default VisualEditor;
