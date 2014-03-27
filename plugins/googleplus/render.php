<?php
/*************************************************************************************************
* Copyright 2014 JPL TSolucio, S.L. -- This file is a part of TSOLUCIO respondCMS Customizations.
* Licensed under the MIT License (the "License"); you may not use this
* file except in compliance with the License. You can redistribute it and/or modify it
* under the terms of the License. JPL TSolucio, S.L. reserves all rights not expressly
* granted by the License. This plugin, distributed by JPL TSolucio S.L. is distributed in
* the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
* warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. Unless required by
* applicable law or agreed to in writing, software distributed under the License is
* distributed on an "AS IS" BASIS, WITHOUT ANY WARRANTIES OR CONDITIONS OF ANY KIND,
* either express or implied. See the License for the specific language governing
* permissions and limitations under the License. You may obtain a copy of the License
* at <https://github.com/madoublet/Respond2/blob/master/license.txt>
*************************************************************************************************
*  Module       : respondCMS Google+
*  Version      : 1.0
*  Author       : JPL TSolucio, S. L.
*************************************************************************************************/
if (empty($var1))
	$gpsize = 'medium';  // default size
else
	$gpsize = $var1;
?>
<div id="googleplusone" class="no"><g:plusone size="<?php echo $gpsize; ?>"></g:plusone></div>
<script type="text/javascript" charset="utf-8" _data='{{language}}' src='https://apis.google.com/js/plusone.js'></script>
