<li class="nav-search dropdown"> <!-- .open to show -->
	<form class="respond-search" data-for="results{{id}}">
      <div class="input-group">
        <input type="text" class="form-control">
        <button class="input-group-addon"><i class="fa fa-search"></i></button>
      </div>  
    </form>  
  	<ul class="dropdown-menu">
	  	<li class="searching"><i class="fa fa-spinner fa-spin"></i> <?php print _("Searching..."); ?></li>
	  	<li class="no-results"><?php print _("No results found"); ?></li>
  	</ul>
</li>