<script>
	import 'node_modules/svelte-material-ui/bare.css"';
	let name = "world";
	//import * as d3 from 'd3';
	import Header from "./Header.svelte";
	import Filter from "./Filter.svelte";
	import Content from "./Content.svelte";

	let views = ["tiles", "bubble", "pcp"];
	let currentView = "tiles";

	let filterStateDefault = {
		yearRange: [],
	};

	let data = [
		{
			title: "example title 1",
			authors: ["author one", "author two"],
			doi: "example doi",
		},
		{
			title: "example title 1",
			authors: ["author one", "author two"],
			doi: "example doi",
		},
	];
</script>

<main>
	<div class="headerContainer">
		<Header {views} {currentView} />
	</div>
	<Filter />
	<Content {data} />
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 200px auto;
	}

	main .headerContainer {
		background: #eee;
		grid-column: 1 / span 2;
	}
</style>
