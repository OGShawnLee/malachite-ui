<div data-testid="focusable-container">
	<button> Focusable </button>
	<section tabindex="0">
		<h1 tabindex="0">Focusable Heading</h1>
		<button> Nested </button>
		<div data-testid="nested-container">
			<button> Focusable </button>
			<button> Not Focusable </button>
		</div>
	</section>
</div>

<div data-testid="invalid-container">
	<button disabled> Not Focusable </button>
	<button tabindex="-1"> Not Focusable </button>
	<div>Not Focusable</div>
</div>
