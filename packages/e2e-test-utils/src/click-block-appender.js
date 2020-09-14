/**
 * Clicks the default block appender.
 */
export async function clickBlockAppender() {
	const frame = await page
		.frames()
		.find( ( f ) => f.name() === 'editor-content' );
	await frame.click( '.block-editor-default-block-appender__content' );
}
