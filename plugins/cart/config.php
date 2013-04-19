<form class="form-horizontal well">
	<div class="control-group">
		<label for="cart-sku" class="control-label">SKU:</label>
		<div class="controls">
			<input id="cart-sku" type="text"  value="" maxlength="100">
		</div>
	</div>

	<div class="control-group">
		<label for="cart-name" class="control-label">Name:</label>
		<div class="controls">
			<input id="cart-name" type="text"  value="" maxlength="100">
		</div>
	</div>

	<div class="control-group">
		<label for="cart-price" class="control-label">Price:</label>
		<div class="controls">
			<input id="cart-price" type="number" value="" maxlength="100">
		</div>
	</div>

	<div class="control-group">
		<div class="controls">
			<button id="cart-addsku" class="btn btn-primary" type="button">Add SKU</button>
		</div>
	</div>
</form>

<h3>Existing SKUs</h3>

<table id="cart-existing" class="table table-striped table-bordered" style="width: 100%">
	<thead>
		<tr>
			<td>SKU</td>
			<td>Name</td>
			<td>Price</td>
			<td></td>
		</tr>
	</thead>
	<tbody>
		<tr id="cart-noskus">
			<td colspan="3">No SKUs for this page.</td>
		</tr>
	</tbody>
</table>