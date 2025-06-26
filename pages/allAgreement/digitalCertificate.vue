<template>
	<view class="digitalCertificate">
		<view class="mainTitle">声明：</view>
		<view class="mainRow subRow">1.您应当认真阅读并遵守《数字证书使用协议》（以下简称“本协议”），本协议具有合同效力，当您勾选确认或点击确认并完成注册后即成立生效。</view>
		<view class="mainRow subRow">2.您务必审慎阅读、充分理解各条款内容，如您对本协议有任何疑问或对任何条款不能准确理解的，请不要进行后续操作。</view>
		<view class="mainRow subRow">3.您承诺接受并遵守本协议的约定，届时您不可以未阅读本协议内容或未获得上海货耘网络科技有限公司（以下简称“我们”）对您问询的解答等理由，主张本协议无效，或要求撤销本协议。</view>
		<view class="mainRow subRow">4.本协议按照电子认证服务提供者（简称”CA机构”）指导文件CPS拟定，包括但不限于：</view>
		<view class="mainRow childRow">①《中国金融认证中心电子认证业务规则（CPS）》</view>
		<view class="mainRow subRow">原文链接：http://www.cfca.com.cn/zhengshuzizhu/</view>
		<view class="mainRow subRow">②《ZJCA电子认证业务规则》</view>
		<view class="mainRow subRow">原文链接：https://www.zjca.com.cn/web/webs/service/download.html</view>
		<view class="mainRow subRow">③《天威诚信电子认证业务规则》</view>
		<view class="mainRow subRow">原文链接：https://www.itrus.com.cn/uploads/soft/200714/guize.pdf</view>
		<view class="mainRow subRow">5.本数字证书服务协议更新日期为 【2021】年【9】月【13】日，将于【2021】年【9】月【13】日正式生效。您一旦进行数字证书的申请（包括续期、更新）、下载或使用，即表明同意接受并愿意遵守本协议的所有条款。</view>
		<view class="mainRow">一、数字证书服务简介</view>
		<view class="mainRow subRow">1.数字证书（是指一段信息，它至少包含了一个名字，标识特定的CA或标识特定的订户，包含了订户的公钥、证书有效期、证书序列号，及CA数字签名）指我们与经过CA机构授权的RA机构（杭州尚尚签网络科技有限公司）合作，针对您提交的实名认证信息进行审核，实名认证审核通过后为您申请数字证书（前述CA机构、RA机构以下统称为“第三方机构”）。</view>
		<view class="mainRow subRow">2.您通过我们完成实名认证后，由第三方机构颁发数字证书，从而获得电子签名服务。</view>
		<view class="mainRow subRow">3.本协议中的“证书”指个人数字证书或企业数字证书。</view>
		<view class="mainRow subRow">4.证书私钥是指数字证书包含证书本身和一个密钥对，密钥对的一部分是公钥，另一部分称为私钥。公钥公之于众，谁都可以使用。私钥只有自己知道，一般信息都是由公钥进行加密，相对应的私钥进行解密。</view>
		<view class="mainRow">二、订户的权利和义务</view>
		<view class="mainRow subRow">1.您应保证所填写的注册信息和所提供的资料的真实性、准确性和完整性，否则有权拒绝您的申请请求。在这些信息、资料发生改变时及时通知我们。如因您提供的资料不真实、不完整、不准确或资料改变后未及时通知我们，造成的损失由订户（指委托我们从第三方机构获得证书的个人、组织机构）自己承担。</view>
		<view class="mainRow subRow">2.您的证书信息在证书有效期限内变更的，应当及时书面告知我们，并终止使用该证书（注：企业名称变更、企业统一社会信用代码变更、经营期限届满、姓名变更、身份证号变更等需要吊销原证书，重新申请数字证书）。</view>
		<view class="mainRow subRow">3.若您为企业用户，您企业因分立、合并、解散、注销、宣告破产或倒闭，或被吊销营业执照等导致主体资格终止的，应于上述情况发生前书面告知我们申请吊销数字证书，并立即终止使用该证书，否则，因未尽该通知义务给我们以及第三方机构造成损失的，由您全部赔偿。</view>
		<view class="mainRow subRow">4.您同意我们向有关部门和个人核实您的信息。我们应合法地收集、处理、传递及使用您的资料，并按照国家有关规定及本协议的约定予以保密。</view>
		<view class="mainRow subRow">5.您对证书享有独立的使用权，您应当合法使用数字证书签署电子文件，并对使用数字证书的行为负责。您使用证书产生的权利，由您享有；您使用证书产生的义务、责任，由您承担。</view>
		<view class="mainRow subRow">6.您应当对您所专有并控制的数字证书及我们账户进行妥善保管，当您收到您在我们账户设置的通知方式（手机和邮箱）收到签署验证码时，应确保签署请求由本人发起，且对验证码承担保密义务。如您使用的数字证书私钥和密码泄漏、丢失，或者您不希望继续使用数字证书，或者您的主体不存在，您应当立即向我们申请废止该数字证书。因您原因致使证书私钥泄露、损毁或者丢失的，损失由您承担。</view>
		<view class="mainRow subRow">7.您损害第三方机构利益的，须向第三方机构赔偿全部损失。这些情形包括但不限于：</view>
		<view class="mainRow subRow">①您在申请数字证书时没有提供真实、准确、完整信息，或在这些信息变更时未及时通知我们；</view>
		<view class="mainRow subRow">②您知道自己的私钥已经失密或者可能已经失密而未及时告知有关各方、并终止使用；</view>
		<view class="mainRow subRow">③您未履行本协议相关约定的其他情形。</view>
		<view class="mainRow subRow">8.第三方机构有权因安全风险因素更换您的数字证书。</view>
		<view class="mainRow subRow">9.如果第三方机构发现了证书的不当使用，或者证书被用于违法甚至犯罪行为，第三方机构有权直接吊销您的证书。证书一旦被吊销，订户将不能再使用该证书。</view>
		<view class="mainRow subRow">10.您申请数字证书后，一旦发现如下情况之一时，应当立即向我们申请吊销此证书：</view>
		<view class="mainRow subRow">①证据表明，此数字证书被用于签署可疑代码，包括但不限于病毒，木马，或者其他不恰当的程序；</view>
		<view class="mainRow subRow">②证书中内容不再正确或不再准确；</view>
		<view class="mainRow subRow">③证书私钥信息已被泄露、丢失，或者其他相关部分已被错误使用。</view>
		<view class="mainRow subRow">11.您可以选择适合您的实名认证方式进行数字证书的申请，获得的证书和证书私钥后，由第三方机构托管，数字证书储存在第三方机构。证书仅用于电子文件签署，我们以及第三方机构确保您使用证书和证书密钥制作的电子签名制作数据专属于您所有并由您控制，仅在您同意的情况下，您的证书方可被调用签署相关的电子合同等法律文件。</view>
		<view class="mainRow subRow">12.您每次签署电子文件都将使用您的数字证书。我们只有核实了您的签署意愿后，才会依据您的意愿使用数字证书签署电子文件。如果启用了指纹签署或自动盖章功能，视为您知情并同意每次签署电子文件的行为都使用您的数字证书。</view>
		<view class="mainRow subRow">13.证书私钥在证书有效期内损毁、丢失、泄露的，您应当及时申请办理吊销手续，吊销自手续办妥时起生效，吊销生效前发生的损失由您承担。</view>
		<view class="mainRow subRow">14.您知悉证书私钥已经丢失或者可能已经丢失时，应当及时告知我们。我们将协助完成吊销该证书的工作。您应终止使用该证书。</view>
		<view class="mainRow subRow">15、根据《电子签名法》的规定，对于与您认证相关的信息以及您签署的电子合同等法律文件，您同意第三方机构有权自您的电子签名认证证书失效后保存十年。</view>
		<view class="mainRow subRow">16、您同意并授权第三方机构将您的身份信息和您签署的电子合同提供给国家司法机关、行政机关，具有司法行政职能的事业单位和社会团体以及电子合同等法律文件的其他签订方。</view>
		<view class="mainRow">三、证书的有效期</view>
		<view class="mainRow subRow">本协议的有效期限为证书的有效期限，证书只能在数字证书有效期限内使用，证书有效期限届满，您需要继续使用的，应当及时办理证书更新手续，本协议有效期限顺延至证书更新期限届满日。在获得您将证书延期的授权前，第三方机构不会主动为您更新证书。</view>
		<view class="mainRow">四、我们的权利</view>
		<view class="mainRow subRow">您有下列情形之一，我们有权向第三方机构申请吊销证书并不承担任何责任。由此给我们或第三方机构造成损失的，您应当承担赔偿责任：</view>
		<view class="mainRow subRow">1.您向我们提供的资料或者信息不真实、不准确或者不完整的。</view>
		<view class="mainRow subRow">2.您证书的信息有变更，未终止使用该证书并通知我们的。</view>
		<view class="mainRow subRow">3.您知悉证书私钥已经丢失或者可能已经丢失时，未终止使用该证书并通知我们的。</view>
		<view class="mainRow subRow">4.您超过证书的有效期限及应用范围使用证书的。</view>
		<view class="mainRow subRow">5.您企业因分立、合并、解散、注销、宣告破产或倒闭，被吊销营业执照等导致主体资格终止而您未及时通知上上签吊销书证书的。</view>
		<view class="mainRow subRow">6.您使用证书用于违法、犯罪活动的。</view>
		<view class="mainRow">五、第三方机构的权利</view>
		<view class="mainRow subRow">有下列情形之一的，第三方机构有权吊销所签发的数字证书：</view>
		<view class="mainRow subRow">①订户申请数字证书时，提供的资料不真实、不准确、不完整；</view>
		<view class="mainRow subRow">②订户未履行本协议约定的义务；</view>
		<view class="mainRow subRow">③订户书面申请吊销数字证书；</view>
		<view class="mainRow subRow">④证书的安全性不能得到保证；</view>
		<view class="mainRow subRow">⑤法律、行政法规规定的其他情况。</view>
		<view class="mainRow">六、免责条款</view>
		<view class="mainRow subRow">因设备故障、电力故障及通讯故障或者电脑病毒、自然灾害、黑客攻击等因素造成您损失的，我们以及第三方机构不承担任何责任。</view>
		<view class="mainRow">七、协议的终止</view>
		<view class="mainRow subRow">有下列情形之一的，本协议终止：</view>
		<view class="mainRow subRow">1.您证书期限届满。</view>
		<view class="mainRow subRow">2.您证书被吊销。</view>
		<view class="mainRow subRow">3.您向我们申请终止本协议，我们同意的。</view>
		<view class="mainRow subRow">4.双方协商终止本协议的。</view>
		<view class="mainRow subRow">5.依据法律、法规等规定，本协议应当终止的。</view>
		<view class="mainRow">八、争议解决条款</view>
		<view class="mainRow subRow">对于任何因履行本协议发生的或与本协议有关的一切争议，双方应首先通过友好协商的方式解决。不能协商解决的，各方均应依照中华人民共和国法律并由被告住所地的人民法院裁判。</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.digitalCertificate {
		background-color: #FFF;
		padding: 32rpx;
		.mainTitle {
			font-size:36rpx;
			font-weight:bold;
			color:#333;
			text-align: center;
			line-height: 44rpx;
			margin-bottom:50rpx;
		}
		.mainRow + .mainRow {
			margin-top:40rpx;
		}
		.mainRow {
			font-size:28rpx;
			color:#333;
			line-height: 40rpx;
		}
		.indent {
			text-indent:30rpx;
		}
		.rightMsg {
			text-align: right;
		}
		.rowTitle {
			font-size:32rpx;
			color:#333;
			line-height: 44rpx;
			font-weight:bold;
			margin-bottom:40rpx;
			margin-top:40rpx;
		}
		.subRow {
			padding: 0 40rpx;
		}
		.childRow {
			padding: 0 60rpx;
		}
		.directoryRow {
			font-size:30rpx;
			color:#333;
			line-height: 40rpx;
			padding: 0 40rpx;
		}
	}
</style>
