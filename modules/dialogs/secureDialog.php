<div class="modal fade" id="secureDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Login or Registration"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-block">
					<div id="selectSecureType" class="select">
						<ul>
							<li data-type="login">
								<a>Login</a>
								<em>Add a username and password for users to login to your site.</em>
							</li>
							<li data-type="registration">
								<a>Registration</a>
								<em>Allows users to register for your site.</em>
							</li>
						</ul>
					</div>    
				</div>
			
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="addSecure" class="primary-button" type="button"><?php print _("Add Login or Registration"); ?></button>
			</div>
			<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->