/**
 * WordPress dependencies
 */
import {
	clickBlockAppender,
	getEditedPostContent,
	createNewPost,
} from '@wordpress/e2e-test-utils';

describe( 'Spacer', () => {
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'can be created by typing "/spacer"', async () => {
		// Create a spacer with the slash block shortcut.
		await clickBlockAppender();
		await page.keyboard.type( '/spacer' );
		await page.keyboard.press( 'Enter' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'can be resized using the drag handle and remains selected after being dragged', async () => {
		// Create a spacer with the slash block shortcut.
		await clickBlockAppender();
		await page.keyboard.type( '/spacer' );
		await page.keyboard.press( 'Enter' );

		const frame = await page
			.frames()
			.find( ( f ) => f.name() === 'editor-content' );

		const [ coord1, coord2 ] = await frame.evaluate( () => {
			const element = document.querySelector(
				'.block-library-spacer__resize-container .components-resizable-box__handle'
			);
			const rect = element.getBoundingClientRect();
			const winRect = window.frameElement.getBoundingClientRect();
			return [
				{
					x: winRect.x + rect.x + rect.width / 2,
					y: winRect.y + rect.y + rect.height / 2,
				},
				{
					x: winRect.x + rect.x + rect.width / 2,
					y: winRect.y + rect.y + rect.height / 2 + 50,
				},
			];
		} );

		await page.mouse.move( coord1.x, coord1.y );
		await page.mouse.down();
		await page.mouse.move( coord2.x, coord2.y );
		await page.mouse.up();

		expect( await getEditedPostContent() ).toMatchSnapshot();

		const selectedSpacer = await frame.$(
			'[data-type="core/spacer"].is-selected'
		);
		expect( selectedSpacer ).not.toBe( null );
	} );
} );
