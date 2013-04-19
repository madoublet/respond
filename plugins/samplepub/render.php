<h3>Sample Plugin (rendered when published)</h3>

<p>
	A plugin rendered at publish time will only update when you re-publish a page.  If you want it to render everytime a user views your page, 
	you need to set the <code>render</code> variable to <code>runtime</code>.  Of course, there are performance benefits to having a plugin render only
	at publish time.  But with Respond CMS, the decision is up to you.  See the <b>samplert</b> example for a runtime plugin.
</p>

<h4>Here are some passed variables</h4>

<table class="table table-striped table-bordered">
	<tbody>
		<tr>
			<td>Plugin Id:</td>
			<td><?php print $id; ?></td>
		</tr>
		<tr>
			<td>Plugin Type:</td>
			<td><?php print $type; ?></td>
		</tr>
		<tr>
			<td>Plugin Name:</td>
			<td><?php print $name; ?></td>
		</tr>
		<tr>
			<td>Render At:</td>
			<td><?php print $render; ?></td>
		</tr>
		<tr>
			<td>Has Configurations:</td>
			<td><?php print $config; ?></td>
		</tr>
		<?php if(isset($var1)){ ?>
		<tr>
			<td>Var 1 (custom):</td>
			<td><?php print $var1; ?></td>
		</tr>
		<?php } ?>
		<?php if(isset($var2)){ ?>
		<tr>
			<td>Var 2 (custom):</td>
			<td><?php print $var2; ?></td>
		</tr>
		<?php } ?>
	</tbody>
</table>