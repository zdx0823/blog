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
 * svg_loading加载图标，返回svg旋转图标的字符串形式html，默认大小是20px，默认css名为svg_loading
 * 参数一：svg图标的css名
 * 参数二：svg图标的尺寸
 * 返回：字符串
 */
Register.prototype.svg_loading = function(className,size){

	var className = className ? className+' svg_loading' : 'svg_loading',
		size = size || 20;

	var html = '\
	<svg \
	   version="1.1" \
	   class="'+className+'" \
	   x="0px" y="0px" \
	   width="'+size+'px" height="'+size+'px" \
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
   return html;
};



/**
 * 生成注册表单
 * @return {[无]}        [无]
 */
Register.prototype.build_reg_form = function(parent){
	// 如果无父级标签则直接返回false
	var parent = parent || this.parent;
	if(!parent) return false;

	// 将旋转svg加载图标存进局部变量，方便使用
 	var svg_loading = this.svg_loading();

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

	this.getRSA();



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
			p = nodes['class_lag_form_warning'],
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
			var e_form = nodes['class_lag_form'],
				p = nodes['class_lag_form_warning'],
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
	console.log(nodes);
	/**
	 * 下列变量从上到下分别是
	 * 表单form
	 * 提示语p
	 * 提示语p下的icon标签i
	 * 提示语p下的文字span
	 */
	var p = nodes['class_lag_form_warning'],
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


/**
 * 生成登录表单
 */
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
	        <p class="lag_form_warning">\
	        	<i class=""></i>\
	        	<span></span>\
	        </p>\
	        <div class="lag_wrap">\
		        <input type="button" name="submit" id="submit" class="log_submit" value="登录">\
	        </div>\
	    </form>',
		selector:'lag_form,lag_form_warning'
	}

	// 存两份，方便使用
	this.log_form_nodes = this.add(log_form_str,parent);
	this.reg_form_nodes = this.log_form_nodes;
}



/**
 *
 * 生成滑块拼图验证器
 * @param  {[对象]} obj [参数]
 * @return {[无]}     [无]
 */
Logged.prototype.imgVer = function(config){

	// 将参数存进对象属性里，方便调用
	this.imgVer_config = {};
	for(var attr in config){
		this.imgVer_config[attr] = config[attr];
	}

	// 计算坐标方法
	this._imgVerCC();

	// 调用绘制方法
	this._imgVer_draw();

	// 调用拼图事件方法
	this._imgVerEvent();

}



/** 
 * 滑块拼图器的事件
 * 无需传入参数，所需参数在内部通过对象属性调用
*/
Logged.prototype._imgVerEvent = function(){

	var _this = this;
	var nodes = this.ver_nodes;

	/**
	 * 从上到下分别是：
	 * adjuster_region：滑动条
	 * adjuster_btn：滑动按钮
	 * ver_bar：浮动拼图
	 * ver_tip：拼图提示
	 * ver_btns_back：返回按钮
	 * ver_btns_refresh：刷新拼图
	 */
	var adjuster_region = nodes['class_adjuster_region'],
		adjuster_btn = nodes['class_adjuster_btn'],
		ver_bar = nodes['class_ver_bar'],
		ver_tip = nodes['class_ver_tip'],
		ver_btns_back = nodes['class_ver_btns_back'],
		ver_btns_refresh = nodes['class_ver_btns_refresh'];

	
	// 滑动按钮时间
	adjuster_btn.onmousedown = function(e){

		// this.toggle为该按钮的开关，如果为false表示按钮正在使用中或还未回到原位，此时禁止操作
		if(this.toggle === false) return;

		// 开关设为false表示按钮使用中
		this.toggle = false;
		// 按下的时候改变背景
		this.style['background-position'] = '-10px -98px';
		
		// 事件源
		var e = e || event;
		
		/**
		 * 从上到下分别是
		 * ver_bar_width：滑块的宽度
		 * ver_bar_left：滑块按钮按下时候滑块的left值
		 * t_region_width：滑动条的总长度
		 * t_region_X：滑动条距离页面左侧的距离
		 * t_btn_width：滑块按钮的宽度
		 */
		var ver_bar_width = offset(ver_bar).w,
			ver_bar_left = getStyle(ver_bar,'left'),
			t_region_width = offset(adjuster_region).w,
			t_region_X = offset(adjuster_region).left,
			t_btn_width = offset(adjuster_btn).w;

		// 设定最小值和最大值，可滑动的最大值是滑动条的总长度减去滑块按钮的宽度
		var min_X = 0,
			max_X = t_region_width - t_btn_width;

		// 鼠标按下时候距离按钮最左侧的距离
		var dis = e.clientX - offset(this).left;

		// diff2用于设置滑块的left值
		var diff2 = null;
		// p_i 为一个微调系数，是滑动条和滑块在滑动的时候看起来更和谐
		var p_i = .82;

		// 鼠标移动滑块和滑块按钮跟这一起移动
		document.onmousemove = function(e){

			/**
			 * 从上到下分别是
			 * 事件源
			 * 滑块的left坐标（参数里用X表示）
			 * 限制滑块按钮的左范围
			 * 限制滑块按钮的右范围
			 */
			var e = e || event,
				X = e.clientX,
				diff = X - dis - t_region_X;
				(diff <= min_X) && (diff = min_X);
				(diff >= max_X) && (diff = max_X);

			// 计算滑块对应的left值
			diff2 = ver_bar_width*diff/max_X*p_i + ver_bar_left;

			// _this.imgVer_config.X为滑块生成时候的自动偏移量，与diff2相加的值小于240时滑块在全图的范围内
			if(diff2+_this.imgVer_config.X <= 240){
				adjuster_btn.style.left = diff + 'px';
				ver_bar.style.left = diff2 + 'px';
			}
		}
		document.onmouseup = function(){
			
			// 鼠标抬起恢复滑块按钮的背景图
			adjuster_btn.style['background-position'] = '-10px -10px';

			// 滑块嵌合的标准是正负2像素，根据情况调用view子方法
			if(diff2 != null && diff2 >= -2 && diff2 <= 2){
				_this._imgVerView('ok');
			}else{
				_this._imgVerView('no',ver_bar_left);	// 传入滑块初始位置
			}
			// 隐藏提示语
			setTimeout(function(){
				startMove({ obj:ver_tip, json:{ bottom:-18 }, times:200 });
			},1500)
			document.onmousemove = document.onmouseup = null;
		}
	}


	/**
	 * 从上到下分别是：
	 * ver_wrap：滑块器的包裹节点
	 * log_form_wrap：登录表单的包裹节点
	 * log：登录按钮本身
	 */
	var ver_wrap = this.lag_nodes['class_ver_wrap'],
		log_form_wrap = this.lag_nodes['class_log_form_wrap'],
		log = this.lag_nodes['log'];

	// 返回按钮事件
	ver_btns_back.addEventListener('click',function(){

		startMove({obj:ver_wrap, json:{left:300,opacity:0}, times:200});
		startMove({obj:log_form_wrap, json:{left:0,opacity:100}, times:200});
		startMove({obj:log, json:{height:186}, times:200});
		
	});

	// 刷新按钮事件，点击刷新整张拼图
	ver_btns_refresh.addEventListener('click',function(){
		_this._imgVer_draw_canvas();
	});

}



/**
 * 
 */
Logged.prototype._imgVerCC = function(){

	var imgs = this.imgVer_config.imgs;

	/**
	 * 从上到下分别是
	 * 拼图的宽度，默认宽高相等
	 * 左右预留空间
	 * 上下预留空间
	 * x方向的系数
	 * y方向的系数
	 * 随机选取一张图片
	 */
	var	t_puzzle_size = 38,
	 	x_padding = 50,
		y_padding = 10,
		x_i = rand(10,26)/10,
		y_i = rand(3,16)/10,
		t_img = imgs[rand(0,imgs.length-1)];

	var X = (x_padding + t_puzzle_size)*x_i,	// 起点x的坐标
		Y = (y_padding + t_puzzle_size)*y_i,	// 起点y的坐标
		d = t_puzzle_size/3;

	this.imgVer_config.X = X;
	this.imgVer_config.Y = Y;
	this.imgVer_config.d = d;
	this.imgVer_config.t_img = t_img;
}



/**
 * 滑块拼图器的表现
 * 参数一：状态
 * 参数二：当参数一为no的时候需要传入滑块的初始位置
 */
Logged.prototype._imgVerView = function(status,ver_bar_left){

	var _this = this;
	var nodes = this.ver_nodes;

	/**
	 * 从上到下分别是：
	 * tip：滑块提示语
	 * span1：“验证正确”或“验证错误”字样
	 * span2：提示语正文
	 * i：提示语的icon图标
	 * btn：滑块按钮
	 * ver_bar：滑块
	 * ver_bg_blur：滑块阴影
	 * ver_high_light：滑块高光
	 * adjuster_tip：滑块按钮提示的icon
	 */
	var tip = nodes['class_ver_tip'],
		span1 = nodes['class_ver_tip_span1'],
		span2 = nodes['class_ver_tip_span2'],
		i = nodes['class_ver_tip_i'],
		btn = nodes['class_adjuster_btn'],
		ver_bar = nodes['class_ver_bar'],
		ver_bg_blur = nodes['class_ver_bg_blur'],
		ver_high_light = nodes['class_ver_high_light'],
		adjuster_tip = nodes['class_adjuster_tip'];


	/**
	 * 从上到下分别是：
	 * 提示语之正确时候的css名和错误时候的css名
	 * 提示语下的icon两种情况的css名
	 * 滑块按钮提示的默认提示以及正确和错误的提示
	 */
	var tip_ok = 'ver_tip_ok',
		tip_no = 'ver_tip_no',

		i_ok = 'fas fa-check-circle',
		i_no = 'fas fa-times-circle',
		
		adjuster_tip_lock = 'fas fa-lock',

		adjuster_tip_ok = 'fas fa-check-circle adjuster_tip_ok',
		adjuster_tip_no = 'fas fa-times-circle adjuster_tip_no';

	// 用于保存上门css名称的变量，声明在外部省得重复声明
	var span1_txt = '',
		span2_txt = '',
		i_status = '',
		tip_status = '',
		adjuster_tip_status = '';

	if(status == 'ok'){
		span1_txt = '验证成功：';
		// 简单地算出百分比
		var diff_1 = parseFloat(((microtime() - btn.on_down_time)/1000).toFixed(1)),
			diff_2 = Math.ceil(99-diff_1);

		span2_txt = diff_1 + 's的速度已经超过'+diff_2+'%的用户';
		i_status = i_ok;
		tip_status = tip_ok;
		adjuster_tip_status = adjuster_tip_ok;

		setTimeout(function(){
			ver_bg_blur.style.opacity = 0;	// 隐藏凹陷
			// 隐藏滑块，快速移动高光，高光结束后执行拼图验证成功的回调
			startMove({obj:ver_bar, json:{ opacity:0 }, fn:function(){
				startMove({ obj:ver_high_light, json:{left:-610}, times:300, delay:200, fn:function(){
					_this.imgVer_config.fn && _this.imgVer_config.fn();
				}});
			}});
		},500)

	}else if(status == 'no'){
		span1_txt = '验证失败：';
		span2_txt = '拖动滑块将悬浮图像正确拼合';
		i_status = i_no;
		tip_status = tip_no;
		adjuster_tip_status = adjuster_tip_no;

		// 滑块闪烁效果，闪烁停止后，滑块按钮归位，滑块归位
		startMove({ obj:ver_bar, json:{ opacity:20 }, times:100, delay:100 });
		startMove({ obj:ver_bar, json:{ opacity:100 }, times:100, delay:200 });
		startMove({ obj:ver_bar, json:{ opacity:0 }, times:100, delay:400 });
		startMove({ obj:ver_bar, json:{ opacity:100 }, times:100, delay:600, fn:function(){
			startMove({ obj:btn, json:{ left:0 }, fn:function(){
				btn.toggle = true;
			},delay:400});
			startMove({ obj:ver_bar, json:{ left:ver_bar_left }, delay:400 });
		} });
		
		// 显示提示语
		startMove({ obj:tip, json:{ bottom:0 }, times:200 });

	}

	/**
	 * 以下的操作都是删掉原来的css名，使用新的css名
	 */
	delClass(i,i_ok);
	delClass(i,i_no);
	addClass(i,i_status);

	delClass(tip,tip_ok);
	delClass(tip,tip_no);
	addClass(tip,tip_status);
	addClass(i,i_status);

	delClass(adjuster_tip,adjuster_tip_lock);
	delClass(adjuster_tip,adjuster_tip_ok);
	delClass(adjuster_tip,adjuster_tip_no);
	addClass(adjuster_tip,adjuster_tip_status);

	// 改变span值
	span1.innerHTML = span1_txt;
	span2.innerHTML = span2_txt;

}



/**
 * 滑块拼图验证器生成的子方法拼图绘制
 * @param  {[元素]} el    [用于包裹的父元素]
 * @param  {[数值]} w     [图片宽度]
 * @param  {[数值]} h     [图片高度]
 * @param  {[字符串]} t_img [图片]
 * @return {[对象]}       [节点集合]
 */
Logged.prototype._imgVer_draw = function(){

	if(!this.imgVer_config) return false;	// 如果滑块生成器没有传入参数即代表这没有初始化，则此方法不可用
	var el = this.imgVer_config.el;	// 获取外容器


	/**
	 * [生成节点]
	 */
	var ver_str = {
		html:'\
				<div class="ver_btns">\
					<i class="fas fa-arrow-left ver_btns_back"></i>\
					<i class="fas fa-redo-alt ver_btns_refresh"></i>\
				</div>\
				<div class="ver">\
					<div class="ver_high_light"></div>\
					<div class="ver_bar">\
					</div>\
					<div class="ver_bg">\
					</div>\
					<p class="ver_tip">\
						<i class="ver_tip_i"></i>\
						<span class="ver_tip_span1"></span>\
						<span class="ver_tip_span2"></span>\
					</p>\
				</div>\
				<div class="adjuster">\
					<div class="adjuster_region">\
						<div class="adjuster_btn"></div>\
						<span>按住左边滑块，拖动完成上方拼图</span>\
					</div>\
					<i class="adjuster_tip fas fa-lock"></i>\
				</div>\
			',
		selector:'ver,ver_btns,ver_btns_back,ver_btns_refresh,ver_high_light,ver_bar,ver_bar_img,ver_bar_blur,ver_bg,ver_bg_blur,ver_bg_img,ver_refresh,ver_tip,ver_tip_span1,ver_tip_i,ver_tip_span2,adjuster,adjuster_region,adjuster_btn,adjuster_tip'
	};

	var ver_nodes = this.ver_nodes = this.add(ver_str,el);

	// 绘制拼图
	this._imgVer_draw_canvas();

	return ver_nodes;
}



/**
 * 绘制拼图
 * 无参数
 */
Logged.prototype._imgVer_draw_canvas = function(){

	// 重新计算坐标，每次绘制拼图都要重新计算一个随机的左边
	this._imgVerCC();

	/**
	 * 以下变量从上到下分别是
	 * 拼图的
	 * 		宽
	 * 		高
	 * 		原图片
	 * 		X轴，即拼图的left值
	 * 		Y轴，即拼图的top值
	 * 		拼图的大小
	 */
	var w = this.imgVer_config.width,
		h = this.imgVer_config.height,
		t_img = this.imgVer_config.t_img,
		X = this.imgVer_config.X,
		Y = this.imgVer_config.Y,
		d = this.imgVer_config.d;

	// 获取两个包裹节点
	var ver_bar = this.ver_nodes['class_ver_bar'],
		ver_bg = this.ver_nodes['class_ver_bg'];

	ver_bar.style.opacity = 1;

	// 覆盖原有内容
	ver_bar.innerHTML = 
	'\
	<canvas class="ver_bar_img" width="'+w+'" height="'+h+'"></canvas>\
	<canvas class="ver_bar_blur" width="'+w+'" height="'+h+'"></canvas>\
	';

	ver_bg.innerHTML = 
	'\
	<canvas class="ver_bg_blur" width="'+w+'" height="'+h+'"></canvas>\
	<img class="ver_bg_img" src="'+t_img+'" width="'+w+'" height="'+h+'">\
	';
	


	/**
	 * 从上到下
	 * 第一个canvas作为拼图图片
	 * 第二个canvas作为第一个canvas的阴影，注：这里的阴影都是用canvas做的
	 * 第三个canvas作为“嵌入”在全图上的一个凹陷，表明第一和第二个组成的拼图的出处
	 */
	var ver_bar_img = ver_bar.querySelector('.ver_bar_img'),
		ver_bar_blur = ver_bar.querySelector('.ver_bar_blur'),
		ver_bg_blur = ver_bg.querySelector('.ver_bg_blur');

	// 手动添加节点入对象
	this.ver_nodes['class_ver_bar_img'] = ver_bar_img;
	this.ver_nodes['class_ver_bar_blur'] = ver_bar_blur;
	this.ver_nodes['class_ver_bg_blur'] = ver_bg_blur;



	/**
	 * [绘制“凹陷”]
	 */
	var ctx = ver_bg_blur.getContext("2d");	// 获取2d上下文环境
	ctx.globalCompositeOperation="xor";		// 设置当前的canvas遮住下面的canvas
	ctx.shadowBlur=10;						// 模糊
	ctx.shadowColor="#fff";					// 投影颜色
	ctx.shadowOffsetX=3;					// 偏移
	ctx.shadowOffsetY=3;					// 偏移
	ctx.fillStyle="rgba(0,0,0,0.7)";		// 填充颜色
	ctx.beginPath();						// 路径开始
	ctx.lineWidth="1";						// 路径宽度
	ctx.strokeStyle="rgba(0,0,0,0)";		// 路径描边

	ctx.moveTo(X,Y);										// 起始点
	ctx.lineTo(X+d,Y);										// 经过
	ctx.bezierCurveTo(X+d,Y-d,X+2*d,Y-d,X+2*d,Y);			// 曲线
	ctx.lineTo(X+3*d,Y);									// 经过
	ctx.lineTo(X+3*d,Y+d);									// 经过
	ctx.bezierCurveTo(X+2*d,Y+d,X+2*d,Y+2*d,X+3*d,Y+2*d);	// 贝塞尔曲线
	ctx.lineTo(X+3*d,Y+3*d);								// 经过
	ctx.lineTo(X,Y+3*d);									// 经过
	ctx.closePath();										// 结束
	ctx.stroke();											// 上描边色
	ctx.fill();												// 上填充色


	/**
	 * [绘制拼图]
	 */
	var ctx_bar_img = ver_bar_img.getContext("2d"),					// 获取2d上下文环境
		img = new Image();											// 新建图片对象

	img.src = t_img;											// 设置将要载入的图片
	img.onload = function(){									// 载图成功后的回调
		ctx_bar_img.drawImage(img,0,0,w,h);							// 填充图片在ctx_bar_img画布上
	}

	ctx_bar_img.beginPath();										// 路径开始
	ctx_bar_img.strokeStyle="rgba(0,0,0,0)";						// 描边色
	ctx_bar_img.moveTo(X,Y);										// 起点
	ctx_bar_img.lineTo(X+d,Y);										// 经过
	ctx_bar_img.bezierCurveTo(X+d,Y-d,X+2*d,Y-d,X+2*d,Y);			// 贝塞尔曲线
	ctx_bar_img.lineTo(X+3*d,Y);									// 经过
	ctx_bar_img.lineTo(X+3*d,Y+d);									// 经过
	ctx_bar_img.bezierCurveTo(X+2*d,Y+d,X+2*d,Y+2*d,X+3*d,Y+2*d);	// 贝塞尔曲线
	ctx_bar_img.lineTo(X+3*d,Y+3*d);								// 经过
	ctx_bar_img.lineTo(X,Y+3*d);									// 经过
	ctx_bar_img.closePath();										// 结束路径
	ctx_bar_img.stroke();											// 上描边色
	ctx_bar_img.shadowColor="black";								// 投影颜色
	ctx_bar_img.shadowBlur=10;										// 投影模糊
	ctx_bar_img.clip();		// 按照已绘出来的形状从图片上裁剪下来，类似于ps的ctrl+shift+i在delete


	/**
	 * [绘制“凹陷”的阴影]
	 */
	var	ctx_bar_blur = ver_bar_blur.getContext("2d");				// 获取2d上下文环境

	ctx_bar_blur.beginPath();										// 路径开始
	ctx_bar_blur.lineWidth="1";										// 路径宽度为1
	ctx_bar_blur.strokeStyle="rgba(0,0,0,0)";						// 路径颜色为透明
	ctx_bar_blur.moveTo(X,Y);										// 起点
	ctx_bar_blur.lineTo(X+d,Y);										// 经过
	ctx_bar_blur.bezierCurveTo(X+d,Y-d,X+2*d,Y-d,X+2*d,Y);			// 曲线
	ctx_bar_blur.lineTo(X+3*d,Y);									// 经过
	ctx_bar_blur.lineTo(X+3*d,Y+d);									// 经过
	ctx_bar_blur.bezierCurveTo(X+2*d,Y+d,X+2*d,Y+2*d,X+3*d,Y+2*d);	// 曲线
	ctx_bar_blur.lineTo(X+3*d,Y+3*d);								// 经过
	ctx_bar_blur.lineTo(X,Y+3*d);									// 经过
	ctx_bar_blur.closePath();										// 结束
	ctx_bar_blur.stroke();											// 上描边色
	ctx_bar_blur.shadowColor="black";								// 投影颜色
	ctx_bar_blur.shadowBlur=20;										// 投影模糊
	ctx_bar_blur.fill();											// 填充颜色

	// 设置滑块偏移量
	this.ver_nodes['class_ver_bar'].style.left = -X + 10 + 'px';							// 设置拼图偏移量

}



/**
 * 登录表单的事件
 * 无参数
 */
Logged.prototype.log_form_event = function(){

	// 请求RSA
	this.getRSA();

	var _this = this;
	var nodes = this.log_form_nodes;
	var submit = nodes['submit'],
		account = nodes['account'],
		pass = nodes['pass'];

	var e_form_wrap = this.lag_nodes['class_log_form_wrap'],
		e_log = this.lag_nodes['log'];

	submit.addEventListener('click',function(){
		
		if(!account.value || !pass.value){
			_this.testWarning('请填写账号和密码');
			return false;
		}else{
			_this.testWarning(null,'可以登录');
		}

		startMove({
			obj:e_log,
			json:{
				height:210
			},
			times:200
		});

		e_form_wrap.style.position = 'relative';
		startMove({
			obj:e_form_wrap,
			json:{
				'left':-300,
				'opacity':0
			},
			times:200
		});

		
		if(!_this.ver_nodes){

			_this.imgVer({
				el:_this.lag_nodes['class_ver_wrap'],
				width:286,
				height:128,
				imgs:['http://localhost/blog/src/img/profile_init/20130113165407182.jpg',
				'http://localhost/blog/src/img/profile_init/20130113165407249.jpg',
				'http://localhost/blog/src/img/profile_init/20130113165407539.jpg',
				'http://localhost/blog/src/img/profile_init/20130113165408128.jpg',
				'http://localhost/blog/src/img/profile_init/20130113165408162.jpg'],
				fn:function(){

					var enc = _this.sealInfo({
						account:account.value,
						pass:pass.value
					});

					var ver_svg = _this.lag_nodes['class_ver_shade'],
						ver_shade_tip = _this.lag_nodes['class_ver_shade_tip'];

					ver_svg.style.display = 'block';
					ver_shade_tip.style.display = 'block';

					ver_shade_tip.innerHTML = '正在登录'

					var ver_wrap = _this.lag_nodes['class_ver_wrap'];
					var log_form_wrap = _this.lag_nodes['class_log_form_wrap'];
					var log = _this.lag_nodes['log'];
					var adjuster_btn = _this.ver_nodes['class_adjuster_btn'];
					var ver_high_light = _this.ver_nodes['class_ver_high_light'];
					
					ajax({
						method:'post',
						url:'php/user.php',
						data:'user_action=askForLog&user_info='+enc,
						success:function(data){
							// 模拟加载时长
							setTimeout(function(){
								if(data){//ver_wrap
									ver_shade_tip.innerHTML = '登录成功，正在跳转';
								}else{
									ver_shade_tip.innerHTML = '登录失败';
									_this.testWarning('用户名或密码错误');
									startMove({obj:ver_wrap, json:{left:300,opacity:0}, times:200});
									startMove({obj:log_form_wrap, json:{left:0,opacity:100}, times:200});
									startMove({obj:log, json:{height:186}, times:200});
									startMove({ obj:adjuster_btn, json:{ left:0 }, fn:function(){
										adjuster_btn.toggle = true;
									},delay:400});
									ver_high_light.style.left = '100px';
								}
								ver_svg.style.display = 'none';
							},500);
						}
					});
				}
			});

		}else{
			_this._imgVer_draw_canvas();
		}


		var ver_wrap = _this.lag_nodes['class_ver_wrap'];
		startMove({obj:ver_wrap, json:{left:0,opacity:100}, times:300});

	});

}





// 在写属于Lag的方法之前先继承需要用到的对象
extend(Lag,CreateMod);
extend(Lag,Register);
extend(Lag,Logged);

/*---------------Lag下的相关方法---------------------*/

// 请求公钥
Lag.prototype.getRSA = function(){

	var _this = this;
	ajax({
		method:'post',
		url:'php/user.php',
		data:'user_action=getPublicKey',
		success:function(data){
			// document.body.innerHTML = data;
			_this.pub_key = data;	// 保存在对象属性中
		}
	});
}



/**
 * 执行
 * @return {[无]} [无]
 */
Lag.prototype.execute = function(){

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
			<div class="log_form_wrap">\
	        	<a class="log_a">\
	        		<span class="log_a_span">登录</span>\
	        		<i class="fas fa-times log_a_i"></i>\
	        	</a>\
			</div>\
			<div class="ver_wrap">\
				<div class="ver_shade">'
					+this.svg_loading('ver_shade_svg',60)+
					'<p class="ver_shade_tip"></p>'+
				'</div>\
			</div>\
        </div>\
        ',
		selector:'log_a,log_form_wrap,ver_wrap,ver_shade,ver_shade_tip'
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
				_this.click_reg_or_log_view(this);
				_this._click_lag_switch_view(e,log);
			}
		});
		log.addEventListener('click',function(e){
			var e = e || event;
			if(!this.on_off){
				this.on_off = true;
				_this.click_reg_or_log_view(this);
				_this._click_lag_switch_view(e,reg);
			}
		});
	}
}

Lag.prototype.click_reg_or_log_view = function(ele){

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
		h = 186;
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
				var wrap_node = _this.lag_nodes['class_log_form_wrap'];
				_this.build_log_form(wrap_node);
				_this.log_form_event();
			}
		}
	});


	ele_a_i.onclick = function(e){
		_this._click_lag_switch_view(e,ele);
	}

}

Lag.prototype._click_lag_switch_view = function(e,ele){

	var _this = this;
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

	if(ele.id == 'log'){
		_this.lag_nodes['class_ver_wrap'].innerHTML = '';
		_this.lag_nodes['class_ver_wrap'].style = '';
		_this.lag_nodes['class_log_form_wrap'].style = '';
	}

}
