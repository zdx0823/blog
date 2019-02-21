/**
 * Lag构造器，对外开放使用
 * @param {[节点]} parent [接收一个左侧栏的btns按钮包裹节点]
 */
function Lag(parent){
	this.parent = parent;
};



/**
 * Register构造器，注册需要的相关方法
 */
function Register(){}



/**
 * svg旋转加载图标，返回字符串，宽高固定
 * @type {String}
 */
Register.prototype.svg_loading = '\
 		<svg \
			version="1.1" \
			class="svg_loading" \
			x="0px" y="0px" \
			width="20px" height="20px" \
			viewBox="0 0 50 50" \
			style="enable-background:new 0 0 50 50;" \
			xml:space="preserve"\
		>\
			<path \
				fill="#000" \
				d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"\
			>\
				<animateTransform \
					attributeType="xml" \
					attributeName="transform" \
					type="rotate" \
					from="0 25 25" to="360 25 25" \
					dur="0.6s" \
					repeatCount="indefinite" \
				/>\
			</path>\
		</svg>';



/**
 * 生成注册表单
 * @return {[无]}        [无]
 */
Register.prototype.build_reg_form = function(parent){
	// 如果无父级标签则直接返回false
	var parent = parent || this.parent;
	if(!parent) return false;

	// 将旋转svg加载图标存进局部变量，方便使用
 	var svg_loading = this.svg_loading;

	var reg_form_str = {
		html:
		'<form class="lag_form">\
	        <div class="input_wrap clearfix">\
		        <label>\
		            <i class="fas fa-user"></i>\
		            <input type="text" name="username" id="username" placeholder="请输入昵称">\
		        </label>\
		        <label>\
		            <i class="fas fa-fingerprint"></i>\
		            <input type="text" name="account" id="account" placeholder="请输入账号">\
		        </label>\
		        <label>\
		            <i class="fas fa-key"></i>\
		            <input type="password" name="password" id="pass" placeholder="请输入密码">\
		            <span></span>\
		        </label>\
		        <label>\
		            <i class="fas fa-key"></i>\
		            <input type="password" name="password" id="confPass" placeholder="重复输入密码">\
		        </label>\
		        <label>\
		            <i class="fas fa-at"></i>\
		            <input type="email" name="email" id="email" placeholder="请输入邮箱">\
		            <a href="javascript:;" id="emailA">获取验证码</a>\
		        </label>\
		        <label>\
		            <i class="fas fa-angle-right"></i>\
		            <input type="text" name="text" id="emailCode" placeholder="请输入验证码">\
		        </label>\
	        </div>\
	        <p class="lag_form_warning">\
	        	<i class=""></i>\
	        	'+svg_loading+'\
	        	<span></span>\
	        </p>\
	        <div class="lag_wrap">\
		        <input type="button" name="submit" id="submit" value="注册">\
		        <input type="reset" name="reset" id="reset" value="重置">\
		        <span>作者备注：密钥的请求可能比加密请求要慢，出现错误可能是密钥为就绪</span>\
	        </div>\
	    </form>',
	    selector:'lag_form,email_a,lag_form_warning,svg_loading'	// 额外获取部分带class值的标签，注意：class名作为键会被加上class_前缀
	};
	// 将add返回的节点存放在this.lag_form_nodes里
	this.reg_form_nodes = this.add(reg_form_str,parent);
}



/**
 * 表单内input所绑定的事件
 * @return {[无]} [无]
 */
Register.prototype.reg_form_event = function(){

	var nodes = this.reg_form_nodes;	// 方便使用
	/**
	 * 从上之下分别是
	 * 账号input
	 * 密码input
	 * 重复密码input
	 * 邮箱input
	 * 发送验证码a
	 * 用户名input
	 * 提交input
	 * 重置input
	 */
	this.input_account = nodes['account'];
	this.input_pass = nodes['pass'];
	this.input_confPass = nodes['confPass'];
	this.input_email = nodes['email'];
	this.input_emailA = nodes['emailA'];
	this.input_emailCode = nodes['emailCode'];
	this.input_username = nodes['username'];
	this.input_submit = nodes['submit'];
	this.input_reset = nodes['reset'];

	var _this = this;

	// 请求公钥
	ajax({
		method:'post',
		url:'php/user.php',
		data:'user_action=getPublicKey',
		success:function(data){
			// document.body.innerHTML = data;
			_this.pub_key = data;	// 保存在对象属性中
		}
	});



	/**
	 * 用户名判断，用户名不能为空，允许重复
	 * @return {[无]}          [无]
	 */
	this.input_username.addEventListener('input',function(){


		var val = _this.input_username.value;	// 用户名input的值
		var txt = val ? null : '昵称不能为空';	// 三目判断

		_this.testAdorn(txt,_this.input_username.parentNode);	//修改icon颜色
		_this.testWarning(txt,'昵称可用');	// 修改提示语

	});// end-用户名判断



	/**
	 * 账号判断，账号不允许重复，长度必须大于7
	 * @return {[无]}          [无]
	 */
	this.input_account.addEventListener('input',function(){

		// 防止快速输入
		/**
		 * 通过调用forbidFastInput方法来限制用户快速键入或删除，该方法返回true或false
		 * 如果为true则直接调用_tmp，否则延迟500毫秒再调用
		 */
		var limit = _this.forbidFastInput(_this.input_account);
		if(limit){
			_tmp();
		}else{
			clearTimeout(_this.input_account.timer);
			_this.input_account.timer = setTimeout(function(){
				_tmp();
			},500);
		}



		/**
		 * input_account方法内的临时方法，包含着检测账号的相关代码
		 * @return {[无]} [无]
		 */
		function _tmp(){

			var account = _this.input_account.value;	// 账号input的值
			var res = _this.testAccount(account);	// 检测账号格式规范并保存返回值

			_this.testAdorn(res,_this.input_account.parentNode);	// 修改icon颜色
			_this.testWarning(res);	// 修改提示语

			// 当res为null时，表示账号格式符合规范，发送账号到后台检测账号是否存在
			if(res === null){
				// 调用方法加密数据并保存返回值
				var enc = _this.sealInfo({
					account:account
				});
				ajax({
					method:'post',
					url:'php/user.php',
					data:'user_action=isAccountExist&user_info='+enc,
					success:function(data){
						// document.body.innerHTML = data;
						var res = (data =='exist') ? '账号已存在' : null; 
						_this.testAdorn(res,_this.input_account.parentNode);	// 附加效果
						_this.testWarning(res,'账号符合要求');
					}
				});
			}
		}

	});	// end-账号判断



	/**
	 * 密码判断，密码不允许全数字或全字母，长度必须大于8；显示密码强弱
	 * @return {[无]}          [无]
	 */
	this.input_pass.addEventListener('input',function(){

		var val = _this.input_pass.value;	// 密码input的值
		var res = _this.testPass(val);	// 检测密码是否符合规范

		_this.testAdorn(res,_this.input_pass.parentNode);	// 修改icon颜色
		_this.testWarning(res,'密码符合要求');	// 修改提示语

		var span = _this.input_pass.parentNode.querySelector('span');	// 获取用于表示强弱的span标签
		// 如果res为null，表示密码格式正确，进行密码强度判断
		if(res === null){
			let strength = _this.testPassStrong(val);	// 调用检测密码强度的方法并保存返回值
			let color = '#333';	// span标签的默认色

			// 表示不同强度对应的文字颜色
			if(strength == '低') color = '#9e9e9e';
			if(strength == '中') color = '#795548';
			if(strength == '强') color = '#4caf50';
			
			// 显示标签、修改颜色、修改文字
			span.style.display = 'block';
			span.style.color = color;
			span.innerHTML = strength;
		}else{
			// 密码不符合规范隐藏span标签
			span.style.display = 'none';
		}

	});	//



	/**
	 * 再次确认密码
	 * @return {[无]}          [无]
	 */
	this.input_confPass.addEventListener('input',function(){
		var pass1 = _this.input_pass.value,	//第一次输入的密码
			pass2 = _this.input_confPass.value;	// 第二次输入的密码
		var res = _this.testPass(pass1);	// 判断第一次输入的密码是否正确

		/**
		 * res的值决定是否修改icon的颜色和提示语，如果第一次输入的密码格式不规范则无需判断两次密码是否相同
		 */
		if(res == null){
			res = (pass1==pass2) ? null : '两次密码不一致';
		}
		_this.testWarning(res);
		_this.testAdorn(res,_this.input_confPass.parentNode);

	});	// end-再次确认密码



	/**
	 * 邮箱检测，邮箱不允许重复
	 * @return {[无]}          [无]
	 */
	this.input_email.addEventListener('input',function(){

		// 防止快速输入
		/**
		 * 通过调用forbidFastInput方法来限制用户快速键入或删除，该方法返回true或false
		 * 如果为true则直接调用_tmp，否则延迟500毫秒再调用
		 */
		var limit = _this.forbidFastInput(_this.input_email);
		if(limit){
			_tmp();
		}else{
			clearTimeout(_this.input_email.timer);
			_this.input_email.timer = setTimeout(function(){
				_tmp();
			},500);
		}


		/**
		 * 此方法与input_account下的tmp方法大同小异
		 * @return {[type]} [description]
		 */
		function _tmp(){

			var email = _this.input_email.value;
			var res = _this.testEmail(email);
			_this.testAdorn(res,_this.input_email.parentNode);
			_this.testWarning(res);

			_this.input_email.is_right = !!!res; // 将邮箱检测结果存进对象方法里

			if(res === null){
				var enc = _this.sealInfo({
					email:email
				});
				ajax({
					method:'post',
					url:'php/user.php',
					data:'user_action=isEmailExist&user_info='+enc,
					success:function(data){
						// document.body.innerHTML = data;
						var res = (data =='exist') ? '邮箱已被注册' : null;
						_this.input_email.is_right = !!!res; // 判断是否存在
						_this.testAdorn(res,_this.input_email.parentNode);	// 附加效果
						_this.testWarning(res,'邮箱可以用于注册');
					}
				});
			}
		}

	});	//end-邮箱检测



	/**
	 * 发送验证码，时间间隔60秒
	 * @return {[无]}          [无]
	 */
	this.input_emailA.onclick = function(){

		var emailA = this;	// 为方便使用

		/**
		 * 根据emailA.timer的值判断“发送验证码”按钮是否已被点
		 * emailA.timer的可能值有underfined、null、定时器的id
		 */
		if(!emailA.timer){

			// 根据在_this.input_email.is_right判断邮箱，为false表示邮箱格式错误或已被注册
			if(_this.input_email.is_right){
				var enc = _this.sealInfo({
					email:_this.input_email.value
				});

				// 设定起始时间，修改a标签的颜色和文本内容
				emailA.s = 60;
				emailA.style.background = '#795548';
				emailA.innerHTML = '重新发送 '+emailA.s;

				// 设置定时器，每个1秒更新a标签的文本内容，如果emailA.s==0则恢复原状
				emailA.timer = setInterval(function(){
					emailA.s--;
					emailA.innerHTML = '重新发送 '+emailA.s;
					if(emailA.s == 0){
						emailA.style.background = '#8BC34A';
						emailA.innerHTML = '发送验证码';
						clearInterval(emailA.timer);
						emailA.timer = null;
					}
				},1000);

				// 向后台发送请求，要求发送验证码
				ajax({
					method:'post',
					url:'php/user.php',
					data:'user_action=sendVeriCode&user_info='+enc,
					success:function(data){
						if(!data){
							// 无网络或其他异常情况
							_this.input_emailA.send_res = data;
							_this.testWarning('网络未连接或其他特殊情况，请重试');
						}else{
							_this.input_emailA.send_res = true;
						}
					}
				});

			}else{
				_this.testWarning('邮箱格式不正确或已被注册');
			}

		}else{
			if(_this.input_emailA.send_res){
				// 验证码正常发送，重复点击反馈提示语
				_this.testWarning('验证码已发送，请到邮箱查收');
			}
			return;
		}


	};	// end-发送验证码



	/**
	 * 验证验证码
	 * @return {[无]}          [无]
	 */
	this.input_emailCode.addEventListener('input',function(){

		var email_code = _this.input_emailCode.value;	// 验证码输入框input的值
		var res = _this.testEmailCode(email_code);	// 检查验证码是否符合规范
		_this.testAdorn(res,_this.input_emailCode.parentNode);	// 修改icon颜色
		_this.testWarning(res);	// 修改提示语

		// 如果res为null表示验证码格式正确，发送用户输入的验证码到后台判断是否一致
		if(res === null){
			var enc = _this.sealInfo({
				email_code:email_code
			});
			ajax({
				method:'post',
				url:'php/user.php',
				data:'user_action=isEmailCodeExist&user_info='+enc,
				success:function(data){

					/**
					 * txt1和txt2都作为提示语，如果txt2有值，txt2优先作为提示语
					 * @type {[type]}
					 */
					var txt1 = txt2 = is_right = null;
					if(data != '验证码错误'){
						is_right = true;
						txt1 = null;
						txt2 = '验证码正确';
					}else{
						is_right = false;
						txt1 = txt2 = data;
					}

					_this.input_emailCode.is_right = is_right; // 判断是否存在
					_this.testAdorn(txt1,_this.input_emailCode.parentNode);	// 附加效果
					_this.testWarning(txt1,txt2);
				}
			});
		}

	});	// end-验证验证码



	/**
	 * 重置表单
	 * @return {[无]}          [无]
	 */
	this.input_reset.addEventListener('click',function(){

		var nodes = _this.reg_form_nodes; //方便使用

		/**
		 * 从上到下分别是
		 * 表单form
		 * 表单下所有的icon标签i
		 * 提示语p
		 * 提示语p下的icon标签i
		 * 提示语p下的文字span
		 */
		var e_form = nodes['class_reg_form'],
			i = e_form.querySelectorAll('i'),
			p = nodes['class_reg_form_warning'],
			p_i = p.querySelector('i'),
			p_span = p.querySelector('span');

		// 恢复所有icon的颜色为默认的灰色，跳过提示语标签下的icon
		i.forEach(function(item){
			if(item.className == 'fas fa-exclamation-triangle') return;
			item.style.color = '#666';
		});
		// 隐藏提示语标签，清空文字，
		p.style.opacity = 0;
		p_span.innerHTML = '';

	});	// end-重置表单



	/**
	 * 发送表单，即发送注册信息到后台
	 * @return {[无]}          [无]
	 */
	this.input_submit.addEventListener('click',function(){

		var submit = this;	// 方便使用
		if(submit.on_off) return;	// 检测是否重复点击

		/**
		 * 从上到下分别是
		 * 账号
		 * 密码
		 * 邮箱
		 * 用户名
		 * 验证码
		 */
		var	account = _this.input_account.value || null,
			pass = _this.input_pass.value || null,
			email = _this.input_email.value || null,
			username = _this.input_username.value || null,
			email_code = _this.input_emailCode.value || null;
		// 缺一不可
		if(!account || !pass || !email || !username || !email_code){
			_this.testWarning('请完善注册信息');
			return;
		}



		/**
		 * 此临时函数包含3个ui状态：等待中、错误、已完成
		 * @param  {[对象]} _this       [最外层对象]
		 * @param  {[字符串]} status      [状态字符串]
		 * @param  {[字符串]} warningWord [警告语]
		 * @return {[无]}             [无]
		 */
		function _tmp(_this,status,warningWord){

			var nodes = _this.reg_form_nodes;	// 方便使用
			/**
			 * 从上到下分别是
			 * 表单form
			 * 提示语p
			 * 提示语p下的icon标签i
			 * 提示语p下的文字span
			 * 提示语下的svg旋转加载icon标签svg
			 * 表单form下所有的input
			 */
			var e_form = nodes['class_reg_form'],
				p = nodes['class_reg_form_warning'],
				p_i = p.querySelector('i'),
				p_span = p.querySelector('span'),
				p_svg = nodes['class_svg_loading'],
				e_form_inputs = e_form.querySelectorAll('input');

			/**
			 * 下面根据status参数更改ui显示，状态有ing、error、ok三种
			 */
			if(status == 'ing'){
			// ing状态

				// 隐藏：提示语p下的icon标签
				// 显示：提示语p下的svg旋转标签
				p_i.style.display = 'none';	
				p_svg.style.display = 'block';

				// 更改提示语
				p_span.innerHTML = '正在注册，请稍后...';

				// 禁用所有input输入
				e_form_inputs.forEach(function(item){
					item.onfocus = function(){
						this.blur();
					}
				});

				// 第一次点击submit按钮，修改按钮的value、颜色、宽度、鼠标指针
				// submit.on_off设为true，防止再次被点击
				// 重置按钮直接隐藏
				if(!submit.on_off){
					submit.value = '请稍后';
					submit.style = '\
						background:#795548;\
						width:100%;\
						cursor:wait;\
						margin:0 !important;\
					';
					submit.on_off = true;
					nodes['reset'].style.display = 'none';
				}

			// 	error 状态
			}else if(status == 'error'){

				// 显示：提示语p下的icon标签
				// 隐藏：提示语p下的svg旋转标签
				p_i.style.display = 'inline-block';	
				p_svg.style.display = 'none';

				// 修改提示语p的颜色为黄色
				p.style.color = '#ffeb3b';

				// 修改提示语p下的icon标签为感叹号
				p_i.setAttribute('class','fas fa-exclamation-triangle');

				// 修改提示语
				p_span.innerHTML = warningWord;

				// 允许所有input标签输入
				e_form_inputs.forEach(function(item){
					item.onfocus = null;
				});

				// 注册按钮恢复为原来的颜色、宽度、鼠标指针，文字恢复为原来的“注册”
				submit.style = '\
					background:auto;\
					width:40%;\
					cursor:pointer;\
					margin:0 10px;\
				';
				submit.value = '注册';

				// submit.on_off设为false，下次允许点击(本事件函数开头通过取反判断)
				submit.on_off = false;

				// 显示重置按钮
				nodes['reset'].style.display = 'inline-block';

			}else if(status == 'ok'){
			// ok状态
			
				// 隐藏：提示语p下的svg旋转标签
				// 显示：提示语p下的icon标签
				p_svg.style.display = 'none';
				p_i.style.display = 'inline-block';	

				// 修改提示语、修改按钮value
				_this.testWarning(null,'注册成功');
				submit.value = '注册成功';

				// 修改注册按钮的颜色成绿色、指针为系统默认
				submit.style.background = '#8bc34a';
				submit.style.cursor = 'default';

				// 解绑“发送验证码”按钮的事件函数
				_this.input_emailA.onclick = null;
			}

		}
		/****************_tmp结束********************************/

		// 点击即进入等待状态
		_tmp(_this,'ing');

		// 加密数据
		var enc = _this.sealInfo({
			account:account,
			pass:pass,
			email:email,
			username:username,
			email_code:email_code
		});

		// 发送数据
		ajax({
			method:'post',
			url:'php/user.php',
			data:'user_action=enroll&user_info='+enc,
			success:function(data){
				// data == 1表示一切正常
				if(data == 1){
					_tmp(_this,'ok');
				}else{
					_tmp(_this,'error',data);
				}
			}
		});

	});	// end-发送表单

}



/**
 * 禁止用户快速输入,通过给传入的input标签设置属性，属性内保存时间戳，两次点击的时间戳差小于100毫秒则为false否则为true
 * @param  {[元素]} ele [input标签]
 * @return {[布尔值]}     [布尔值]
 */
Register.prototype.forbidFastInput = function(ele){
	var res = (ele.pre_time && ((microtime()-ele.pre_time)<100)) ? false : true;
	ele.pre_time = microtime();
	return res;
}



/**
 * 更改icon的颜色
 * @param  {[字符串]} warningWord [警告语]
 * @param  {[元素]} label       [input的父级label标签]
 * @return {[无]}             [无]
 */
Register.prototype.testAdorn = function(warningWord,label){
	var i = label.querySelector('i');
	if(warningWord == null){
		i.style.color = '#8bc34a';	// 红色
	}else{
		i.style.color = '#f44336';	// 绿色
	}
}



/**
 * 提示语设置，
 * @param  {[字符串]} warningWord [警告语]
 * @param  {[字符串]} word2       [其他警告语]
 * @return {[无]}             [无]
 */
Register.prototype.testWarning = function(warningWord,word2){

	var nodes = this.reg_form_nodes;	// 方便使用

	/**
	 * 下列变量从上到下分别是
	 * 表单form
	 * 提示语p
	 * 提示语p下的icon标签i
	 * 提示语p下的文字span
	 */
	var e_form = nodes['class_reg_form'],
		p = nodes['class_reg_form_warning'],
		p_i = p.querySelector('i'),
		p_span = p.querySelector('span');
	
	// 显示提示语p
	p.style.pacity = 1;

	// 如果参数warningWord不为null
	if(warningWord){
		p_i.setAttribute('class','fas fa-exclamation-triangle'); // 更换成感叹号
		p.style.color = '#ffeb3b';	// 黄色
		p_span.innerHTML = warningWord;	// 填充提示语
	}else{
		p_i.setAttribute('class','fas fa-check-circle');	// 更换成勾
		p.style.color = '#8bc34a';	// 绿色
		var txt = (!!word2) ? word2 : '可以注册';	// 如果参数2存在则用参数2替代参数1作为提示语
		p_span.innerHTML = txt;	// 填充提示语
	}

}



/**
 * 验证账号是否符合要求，账号只能包含字母数字下划线美元符号，且不能以数字开头
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
Register.prototype.testAccount = function(account){
	// 账号只能包含字母数字下划线美元符号，且不能以数字开头
	var re = /^[a-zA-Z$]([a-zA-Z0-9$])*$/;						// 字母数字美元符号
	var re_no_chinese = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g;		// 中文字符
	var res = null;

	if(account.length < 7 || account.length > 16 ){
		if(account.length == 0){
			res = '账号不能为空。';
		}else{
			res = '账号长度必须大于7位且小于16位。';
		}		
	}else{
		if(!re.test(account)){	// 允许字母数字美元符号
			res = '账号只能包含数字、字母、美元符号，且必须以字母开头。';
		}
		if(re_no_chinese.test(account)){	// 禁止中文
			res = '账号不能包含中文。';
		}
	}

	return res;

}



/**
 * 验证密码是否符合要求
 * @param  {[字符串]} pass [密码]
 * @return {[字符串]}      [提示语或强度语]
 */
Register.prototype.testPass = function(pass){

	var re_no_all_num = /^\d+$/,			// 禁止全数字
		re_no_all_alp = /^[a-zA-Z]+$/;		// 禁止全字母

	//  返回值
	var res = null;

	// 密码要求限制
	if(pass.length == 0){
		res = '密码不能为空。';
	}else if(pass.length < 8 || pass.length > 32){
		res = '密码长度必须大于8位且小于32位。';
	}else if(re_no_all_num.test(pass) || re_no_all_alp.test(pass)){
		res = '密码不能全为数字或全为字母';
	}
	return res;

}



/**
 * 检测密码强度
 * @param  {[字符串]} pass [密码]
 * @return {[字符串]}      [低、中、强]
 */
Register.prototype.testPassStrong = function(pass){

	var	re_num_sym = /^[^a-zA-Z\s]+$/,		// 数字、符号组合
		re_num_alp = /^[a-zA-Z0-9]+$/,		// 数字、字母组合
		re_alp_sym = /^[^0-9\s]+$/,			// 字母、符号组合
		re_num_alp_sym = /^\S+$/,			// 数字、字母、符号组合
		re_multiple = /(\S)\1{2,}/;			// 禁止连续3个字符重复

	// 等级设置
	var lv = 0,
		lv_arr = ['低','中','强'];

	// 如果为数字、符号，数字、字母和字母、符号的组合方式则密码强度为低或中
	if( re_num_sym.test(pass) || re_num_alp.test(pass) || re_alp_sym.test(pass) ){
		// 这种情况下，密码长度大于18位则强度为中
		lv = (pass.length >= 18) ? 1 : 0;
	
	// 如果是数字、字母、符号混合的密码，强度为中或强
	}else if( re_num_alp_sym.test(pass) ){

		// 如果有重复为中
		if(re_multiple.test(pass)){
			lv = 1;
		}else{
			// 无重复且密码长度大于12位则强度为强，小于12位为中
			lv = (pass.length >= 12) ? 2 : 1;
		}

	}
	return lv_arr[lv];

}



/**
 * 判断邮箱是否符合要求
 * @param  {[字符串]} email [邮箱]
 * @return {[布尔值]}       [true或false]
 */
Register.prototype.testEmail = function(email){

	var re = /^\S+@\S+\.(top|club|com|ink|pub|site|xyz|cn|link|art|biz|love|online|shop|run|wang|net|cc|store|ltd|red|mobi|kim|com\.cn|net\.cn|gov\.cn|org|info|tech|pro|vip|ren|xin)$/;
	return re.test(email) ? null : '邮箱格式不正确';

}



/**
 * 判断验证码是否符合规范
 * @param  {[字符串]} email_code [邮箱验证码]
 * @return {[字符串]}       [提示语]
 */
Register.prototype.testEmailCode = function(email_code){

	var res = null;
	if(email_code){
		if(email_code.length != 6) res = '验证码错误';
	}else{
		res = '验证码不能为空';
	}
	return res;

}



/**
 * 整合并加密用户注册信息
 * @param  {[对象]} obj [包含用户的用户名密码账号邮箱验证码]
 * @return {[字符串]}     [返回16进制字符串]
 */
Register.prototype.sealInfo = function(obj){

	var obj = obj || {};

	/**
	 * 下列变量从上到下分别是
	 * 账号
	 * 密码
	 * 邮箱
	 * 用户名
	 * 验证码
	 */
	var account = '',
		pass = '',
		email = obj.email || '',
		username = obj.username || '',
		email_code = obj.email_code;

	// 账号和密码取md5摘要为其值
	if(obj.account){ account = md5(obj.account); }
	if(obj.pass){ pass = md5(obj.pass); }

	// 分号分隔
	var mass = account+pass+';'+email+';'+username+';'+email_code;

	// 加密
    var pub = KEYUTIL.getKey(this.pub_key);
    var enc = KJUR.crypto.Cipher.encrypt(mass,pub);
    return enc;

}



/**
 * 已登录的构造器
 */
function Logged(){}
Logged.prototype.build_log_form = function(parent){
	var parent = parent || this.parent;
	if(!parent) return false;

	var log_form_str = {
		html:
		'<form class="lag_form">\
	        <div class="input_wrap clearfix">\
		        <label>\
		            <i class="fas fa-fingerprint"></i>\
		            <input type="text" name="account" id="account" placeholder="请输入账号">\
		        </label>\
		        <label>\
		            <i class="fas fa-key"></i>\
		            <input type="password" name="password" id="pass" placeholder="请输入密码">\
		            <span></span>\
		        </label>\
	        </div>\
	        <div class="lag_wrap">\
		        <input type="button" name="submit" id="submit" value="登录">\
	        </div>\
	    </form>'
	}

	this.log_form_nodes = this.add(log_form_str,parent);
}




// 在写属于Lag的方法之前先继承需要用到的对象
extend(Lag,CreateMod);
extend(Lag,Register);
extend(Lag,Logged);

/*---------------Lag下的相关方法---------------------*/

/**
 * 判断用户是否登录
 * @return {混合} [如果登录返回用户临时id，如果未登录返回false]
 */
Lag.prototype.is_logged = function(){
	var Z = getCookie('Z');
	this.Z = Z ? Z : false;
}



/**
 * 执行
 * @return {[无]} [无]
 */
Lag.prototype.execute = function(){
	this.is_logged(); // 调用is_logged方法，将判断判断用户是否登录
	if(!this.Z){
		// 未登录，调用生成注册按钮和登录按钮的方法
		this.buildLagBtn();
	}else{
		// 已登录，调用填写数据方法
		this.fillin();
	}
	// 执行事件方法
	this.event();
}


/**
 * 生成登录注册的按钮
 * @return {[字符串]} [如果没有父节点则返回提示文字]
 */
Lag.prototype.buildLagBtn = function(){
	// 注册按钮的html字符串
	var lag_btns_obj = {
		html:'\
        <div class="clearfix" id="reg">\
        	<a class="reg_a">\
        		<span class="reg_a_span">注册</span>\
        		<i class="fas fa-times reg_a_i"></i>\
        	</a>\
        </div>\
        <div class="clearfix" id="log">\
        	<a class="log_a">\
        		<span class="log_a_span">登录</span>\
        		<i class="fas fa-times log_a_i"></i>\
        	</a>\
        </div>\
        '
	};

	if(this.parent){
		// 执行add方法，将按钮添加进this.parent指定的节点中
		this.lag_nodes = this.add(lag_btns_obj,this.parent);
	}else{
		return '未传入父级节点';
	}

}

/**
 * 事件
 * @return {[无]} [无]
 */
Lag.prototype.event = function(){
	var _this = this;
	// 登录注册按钮事件
	if(this.lag_nodes){
		var reg = _this.reg = this.lag_nodes['reg'];
		var log = _this.log = this.lag_nodes['log'];

		reg.addEventListener('click',function(e){
			var e = e || event;
			if(!this.on_off){
				this.on_off = true;
				_this.click_reg_or_log(this);
				_this._click_lag_switch(e,log);
			}
		});
		log.addEventListener('click',function(e){
			var e = e || event;
			if(!this.on_off){
				this.on_off = true;
				_this.click_reg_or_log(this);
				_this._click_lag_switch(e,reg);
			}
		});	
	}
}

Lag.prototype.click_reg_or_log = function(ele){

	var _this = this;
	var ele_id = ele.id;
		ele_a = ele.querySelector('a'),
		ele_a_span = ele.querySelector('span'),
		ele_a_i = ele.querySelector('i');

	ele.style = '\
		background:#3b4c54;\
		cursor:default;\
	';

	ele_a.style = '\
		font-size:.14rem;\
		font-weight:bold;\
	';

	ele_a_span.style = '\
		float:left;\
		margin-left:14px;\
	';

	ele_a_i.style.display = 'block';

	var w = null,
		h = null;
	if(ele_id == 'reg'){
		w = 306;
		h = 300;
	}else if(ele_id == 'log'){
		w = 306;
		h = 180;
	}

	startMove({
		obj:ele,
		json:{
			'width':w,
			'height':h,
			'border-radius':5
		},
		times:100,
		fn:function(){
			if(ele_id == 'reg'){
				_this.build_reg_form(ele);
				_this.reg_form_event();
			}else if(ele_id == 'log'){
				_this.build_log_form(ele);
				// _this.log_form_event();
			}
		}
	});


	ele_a_i.onclick = function(e){
		_this._click_lag_switch(e,ele);
	}

}

Lag.prototype._click_lag_switch = function(e,ele){
	var e = e || event;
	var ele_form = ele.querySelector('form');
	if(!ele_form) return;

	var ele_a = ele.querySelector('a'),
		ele_a_span = ele.querySelector('span'),
		ele_a_i = ele.querySelector('i');

	ele_form.remove();
	ele.style = 
	ele_a.style = 
	ele_a_span.style = '';
	ele_a_i.style.display = 'none';
	ele.on_off = !ele.on_off;
	e.stopPropagation();
}