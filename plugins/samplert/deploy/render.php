<h3>Sample Plugin (rendered at runtime)</h3>

<p>
	A plugin rendered at run time will be rendered everytime a user visits a page.  Of course, there are performance implications to having a plugin render at run time.
	But with Respond CMS, the decision is up to you.  See the <b>samplepub</b> example for a publish plugin.
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