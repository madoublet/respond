<div id="<?php print $id; ?>" class="plugin-poll" data-id="<?php print $id; ?>">
  
  <div class="take-poll">
  <?php if(isset($question)){ ?>
  	<h5 class="poll-question"><?php print $question; ?></h5>
  <?php } ?>
  <?php if(isset($option1)){ ?>
  	<label class="radio"><input type="radio" name="<?php print $id; ?>" value="option1"> <?php print $option1; ?></label>
  <?php } ?>
  <?php if(isset($option2)){ ?>
  	<label class="radio"><input type="radio" name="<?php print $id; ?>" value="option2"> <?php print $option2; ?></label>
  <?php } ?>
  <?php if(isset($option3)){ ?>
  	<label class="radio"><input type="radio" name="<?php print $id; ?>" value="option3"> <?php print $option3; ?></label>
  <?php } ?>
  <?php if(isset($option4)){ ?>
  	<label class="radio"><input type="radio" name="<?php print $id; ?>" value="option4"> <?php print $option4; ?></label>
  <?php } ?>
  <?php if(isset($option5)){ ?>
  	<label class="radio"><input type="radio" name="<?php print $id; ?>" value="option5"> <?php print $option5; ?></label>
  <?php } ?>
  	<p>
  		<button class="btn">Submit and View Results</button>
  		<a href="#">View Results</a>
  	</p>
  </div>

  <div class="poll-results" data-id="<?php print $id; ?>">
  	<h4>Results (<span class="total"></span> submissions)</h4>

  <?php if(isset($option1)){ ?>
  	<div class="result result-option1">
  		<h5><?php print $option1; ?></h5>
  		<div class="progress">
  			<div class="bar"></div>
  		</div>
  		<p><span class="progress-percent"></span>%, <span class="progress-count"></span> responses</p>
  	</div>
  <?php } ?>
  <?php if(isset($option2)){ ?>
  	<div class="result result-option2">
  		<h5><?php print $option2; ?></h5>
  		<div class="progress">
  			<div class="bar"></div>
  		</div>
  		<p><span class="progress-percent"></span>%, <span class="progress-count"></span> responses</p>
  	</div>
  <?php } ?>
  <?php if(isset($option3)){ ?>
  	<div class="result result-option3">
  		<h5><?php print $option3; ?></h5>
  		<div class="progress">
  			<div class="bar" style="width: 20%"></div>
  		</div>
  		<p><span class="progress-percent"></span>%, <span class="progress-count"></span> responses</p>
  	</div>
  <?php } ?>
  <?php if(isset($option4)){ ?>
  	<div class="result result-option4">
  		<h5><?php print $option4; ?></h5>
  		<div class="progress">
  			<div class="bar" style="width: 20%"></div>
  		</div>
  		<p><span class="progress-percent"></span>%, <span class="progress-count"></span> responses</p>
  	</div>
  <?php } ?>
  <?php if(isset($option5)){ ?>
  	<div class="result result-option5">
  		<h5><?php print $option5; ?></h5>
  		<div class="progress">
  			<div class="bar" style="width: 20%"></div>
  		</div>
  		<p><span class="progress-percent"></span>%, <span class="progress-count"></span> responses</p>
  	</div>
  <?php } ?>
  </div>
</div>