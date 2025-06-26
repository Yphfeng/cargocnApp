<template>
	<view class="all-box">
		<view class="table">
			<view class="table-box">
				<view class="table-row">运输合同：{{contractObj.contractNo?contractObj.contractNo:''}}</view>
				<view class="table-row2" v-if="userRole==2">甲方（发货人）：{{senderUserName || userInfo.userName}}</view>
				<view class="table-row2" v-if="userRole==1">甲方（发货人）：{{senderUserName || ''}}</view>
				<view class="table-row2" v-if="userRole==2">乙方（司机）：{{taskId?contractObj.driverUserName:''}}</view>
				<view class="table-row2" v-if="userRole==1">乙方（司机）：{{taskId?contractObj.driverUserName: userInfo.userName}}</view>
				<view class="table-row2">运单号：{{taskId?taskId:''}}</view>
				<view class="table-row1">
					<view class="deliver-goods">发货人姓名</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.senderUserName:userInfo.userName}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.senderUserName:''}}</view>
					<view class="deliver-goods">发货人电话</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.senderPhone:userInfo.mobile}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.senderPhone:''}}</view>
				</view>
				<view class="table-row2" v-if="userRole==2">发货人身份证号：{{taskId?contractObj.senderIdNo:userInfo.attrs.idNo}}</view>
				<view class="table-row2" v-if="userRole==1">发货人身份证号：{{taskId?contractObj.senderIdNo:''}}</view>
				<view class="table-row1">
					<view class="deliver-goods">司机姓名</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.driverUserName:''}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.driverUserName:userInfo.userName}}</view>
					<view class="deliver-goods">司机电话</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.driverPhone:''}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.driverPhone:userInfo.mobile}}</view>
				</view>
				<view class="table-row1">
					<view class="deliver-goods">司机身份证号</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.driverIdNo:''}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.driverIdNo:userInfo.attrs.idNo}}</view>
					<view class="deliver-goods">车牌号</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.vehicleNo:''}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.vehicleNo:quoteDetails.plateNo}}</view>
				</view>
				<view class="table-row1">
					<view class="deliver-goods">要求装货时间</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.requireShipmentDate:quoteDetails.loadTimeObj1?quoteDetails.loadTimeObj1.startTime + '-' + quoteDetails.loadTimeObj1.endTime:''}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.requireShipmentDate:quoteDetails.startDt+ '-' + quoteDetails.endDt}}</view>
					<view class="deliver-goods">装货地</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.shipmentAddress:startAddress1.address}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.shipmentAddress:quoteDetails.newStartAddr?quoteDetails.newStartAddr:quoteDetails.startAddr}}</view>
				</view>
				<view class="table-row1">
					<view class="deliver-goods">要求卸货时间</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.requireDischargeDate:quoteDetails.loadTimeObj3?('最早卸货时间抵达后' + quoteDetails.loadTimeObj3.startTime + '小时，最晚卸货时间抵达后' + quoteDetails.loadTimeObj3.endTime + '小时'):''}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.requireDischargeDate: '最早卸货时间抵达后' + (quoteDetails.earlyUnLoadDt || 0) + '小时，最晚卸货时间抵达后' + (quoteDetails.endUnLoadDt || 0) +'小时'}}</view>
					<view class="deliver-goods">装货联系人</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.shipmentUserName:contactUser.user1.userName?contactUser.user1.userName:defaultContact.userName}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.shipmentUserName:''}}</view>
				</view>
				<view class="table-row1">
					<view class="deliver-goods">货物名称</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.goodsName:quoteDetails.setGoodsName}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.goodsName:quoteDetails.goods}}</view>
					<view class="deliver-goods">卸货地</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.requireDischargeAddress:endAddress1.address}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.requireDischargeAddress:quoteDetails.newEndAddr?quoteDetails.newEndAddr:quoteDetails.endAddr}}</view>
				</view>
				<view class="table-row1">
					<view class="deliver-goods">重量体积</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.weightVolume:quoteDetails.weightVolume}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.weightVolume:quoteDetails.weightVolume}}</view>
					<view class="deliver-goods">卸货联系人</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?contractObj.dischargeUserName:contactUser.user3.userName?contactUser.user3.userName:defaultContact.userName}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?contractObj.shipmentUserName:''}}</view>
				</view>
				<view class="table-row1">
					<view class="deliver-goods">车型车长</view>
					<view class="deliver-goods-content" v-if="userRole==2">
						<!-- 运单详情页面的合同中的车型车长是同一个字段所以只用展示一个view（写两个是为了换行区分） -->
						<view class="">{{taskId?contractObj.vehicleTypeLength:quoteDetails.orderVehicleModel}}</view>
						<view class="" v-if="!taskId">{{taskId?contractObj.vehicleTypeLength:quoteDetails.vehicleLength}}</view>
					</view>
					<view class="deliver-goods-content" v-if="userRole==1">
						<!-- 运单详情页面的合同中的车型车长是同一个字段所以只用展示一个view（写两个是为了换行区分） -->
						<view class="">{{taskId?contractObj.vehicleTypeLength:quoteDetails.orderVehicleModel?quoteDetails.orderVehicleModel:'冷藏车'}}</view>
						<view class="" v-if="!taskId">{{taskId?contractObj.vehicleTypeLength:quoteDetails.orderVehicleLength}}</view>
					</view>
					<view class="deliver-goods">单价运费</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{quotationWay==2?'价格电议':taskId?setPrice(contractObj.amount/100)+'元':''}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{quotationWay==2?'价格电议':taskId?setPrice(contractObj.amount/100)+'元':quoteDetails.quotePrice?setPrice(quoteDetails.quotePrice)+'元':''}}</view>
				</view>
				<view class="table-row1">
					<view class="deliver-goods">订金</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{taskId?setPrice(contractObj.messageAmount/100)+'元':quoteDetails.infoPrice?setPrice(quoteDetails.infoPrice)+'元':''}}{{informationFlag==1?'退还':'不退还'}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{taskId?setPrice(contractObj.messageAmount/100)+'元':setPrice(quoteDetails.informationPrice)+'元'}}{{informationFlag==1?'退还':'不退还'}}</view>
					<view class="deliver-goods">回单</view>
					<view class="deliver-goods-content" v-if="userRole==2">{{quoteDetails.needReceipt?'需要':'不需要'}}</view>
					<view class="deliver-goods-content" v-if="userRole==1">{{quoteDetails.receiptType?'需要':'不需要'}}</view>
				</view>
				<view class="table-row2" v-if="userRole==2">其他约定：{{taskId?contractObj.remark:requiredValText + ' ' + quoteDetails.remark}}</view>
				<view class="table-row2" v-if="userRole==1">其他约定：{{taskId?contractObj.remark:quoteDetails.loadFactor + ' ' + quoteDetails.remark}}</view>
			</view>
		</view>
		<view class="mainContent">
			<view class="mainRow">本《运输合同》（“本合同”）由托运人（“发货人”）与承运人（“司机”）就司机为发货人提供货物运输服务（“服务”）所的签订的有效合约。本合同项下发货人与司机合称为“双方”，单独地称为“一方”。</view>
			<view class="mainRow">为便于双方就服务达成一致，货运中国平台仅按双方确认的信息与条件，免费生成本合同的电子版本供双方审阅。货运中国平台不是本合同主体，与合同及本合同项下的任何权利义务均无关。</view>
			<view class="mainRow">双方通过在货运中国平台点击“确定报价”、“确认用车”或“接受”键或以其他方式确认接受本合同或已实际享有本合同项下的权益或已实际执行本合同项下的约定（“确认”），即表示双方已达成合同并同意接受本合同全部约定内容的约束。</view>
			<view class="mainRow">在确认本合同之前，请双方仔细阅读本合同的全部内容。如一方不同意本合同的任意内容，或者无法准确理解本合同任何条款的含义，请不要进行确认及后续操作。</view>
			<view class="mainRow">1. 定义</view>
			<view class="mainRow">1.1 货运中国平台：指由上海货耘科技有限公司发行，可以提供发布车辆信息及/或货源信息、搜索货源信息及/或车辆信息、联系车辆及/或发货人及/或接受其他物流信息服务/物流增值服务的软件。</view>
			<view class="mainRow">1.2 发货人：指有货物运输需求并委托货运中国平台提供服务的主体，包含自然人、法人及非法人组织。</view>
			<view class="mainRow">1.3 司机：指在依法有权进行货物运输的情况下，能够提供货物运输服务的自然人，包括主驾和副驾（如有）。</view>
			<view class="mainRow">1.4 货物信息：指您通过货运中国平台发布的与单次货物运输相关的信息，包括但不限于装卸货地点、货物类型/种类、装卸货时间、运输日期/期限、货物重量/数量/体积、所需车辆规格及数量、特殊运输要求等相关信息等信息。</view>
			<view class="mainRow">1.5 保证金：指司机、发货人双方进行交易前交付平台用于保证了履约的款项</view>
			<view class="mainRow">1.6 订金：是指司机按照双方运输协议的约定将指定货物运输到约定地点进行担保而向货主支付的一定金额的款项。货主发货时可选择可退或不可退，在货源页面有明确展示。若选择可退，生成运单后由货主操作退还。</view>
			<view class="mainRow">1.7 运单信息：指司机与发货人通过货运中国平台就货物运输达成交易的相关信息，包括但不限于下单时间、付款时间、订金金额、运单号等。</view>
			<view class="mainRow">1.8 收货人：指发货人指定的收取运输货物的自然人、法人或非法人组织。</view>
			<view class="mainRow">1.9 法律/法律法规：指法律、行政法规、规章、地方性法规、政府政策/文件、强制性国家标准等规范性法律文件。</view>
			<view class="mainRow">1.10 危险货物：指具有爆炸、易燃、毒害、感染、腐蚀等危险特性，在生产、经营、运输、储存、使用和处置中，容易造成人身伤亡、财产损毁或者环境污染而需要特别防护的物质和物品。危险货物以《危险货物分类和品名编号》（GB6944）、《危险货物品名表》（GB12268）、《危险货物道路运输规则》（JT/T617-2018）、法律法规所列为准。</view>
			<view class="mainRow">1.11 违禁品：指法律规定不准私自制造、购买、使用、持有、储存、运输进出口的物品。</view>
			<view class="mainRow">1.12 限运货物：依据相关法律法规，运输某些货物必须携带一定数量的证明文件，包括但不限于烟草专卖品、植物和植物产品的部分、动物源性产品、不明物品等。</view>
			<view class="mainRow">1.13 常温普通货物：指货物在运输、装卸以及保管过程中没有特殊要求包括但不限于温度、车辆特殊证件等，不需要采用特殊运输方式或手段即可运送的货物。</view>
			<view class="mainRow">2. 货物运输交易</view>
			<view class="mainRow">2.1 发货人履约规则</view>
			<view class="mainRow">1) 发货人应当保证托运货物包装符合国家或行业包装标准，已符合短途、长途运输的基本要求，可以抵抗运输过程中正常的摩擦、刹车、道路颠簸、搬运装卸承受力等。如货物因包装不合格导致损失，将自行承担责任。</view>
			<view class="mainRow">2) 发货人应当在将货物交运前仔细核查承运司机和车辆信息是否符合运单记载的信息及承运司机和车辆是否具有相应运输资质。如承运司机或车辆与运单记载不一致或缺乏相应运输资质的，发货人有权拒绝交货，并应当及时通知货运中国平台，平台将在核实情况后对该司机账号进行相应处理。</view>
			<view class="mainRow">3) 发货人应保证司机按照运单到达指定装卸货地点后能按时开始装卸货，否则发货人应当对司机进行赔偿。</view>
			<view class="mainRow">4) 发货人应当按时、足额支付运费，不得单方要求变更运费金额或支付方式，不得以任何理由拒绝或拖延支付运费。</view>
			<view class="mainRow">5) 发货人无正当理由拒绝司机承运的，应赔偿司机损失并扣除相应费用。</view>
			<view class="mainRow">2.2 司机履约规则</view>
			<view class="mainRow">1) 发货人与司机达成货物运输交易后，司机应当按照运单要求按时到达装货地点装货，如司机延迟到达装货地点的，发货人有权要求司机按照迟到时长赔偿损失或拒绝司机承运，货运中国平台将在司机的保证金中扣除相应金额作为发货人的赔偿，如保证金额不足以弥补发货人损失的，司机还应当赔偿发货人损失。</view>
			<view class="mainRow">2) 司机装货时，应现场谨慎核查货物是否属于相关法律法规规定的违禁品、危险货物、未办理证明文件的限运货物。如司机发现货物属于违禁品、危险货物及不能提供相应证明文件的限运货物的，司机应拒绝装货并及时报告货运中国平台。</view>
			<view class="mainRow">3) 司机在收取发货人货物时，在货物运输出发前，需要仔细检查车辆是否超载、超高等情况，如出现此情况，应立即向对方提出要求按照符合法律、法规规定执行。如司机承运货物后，发生因车辆超载、超高等情况被政府机关扣车、罚款或发生交通事故的，则由司机承担全部责任。</view>
			<view class="mainRow">4) 在装载货物时，司机应认真清点承运货物数量、核对品种、确认质量。必要时还要做好货物隔离防护、加固及防雨防潮等措施，保证货物安全。司机与装货联系人应在起运前完成交接手续。</view>
			<view class="mainRow">5) 司机在运输过程中，应当按照适用的道路安全法律法规驾驶，不疲劳驾驶、不酒驾、不醉驾、不毒驾，保证货物安全及人身安全（包括但不限于提供货物运输服务时的连续驾驶时间不得超过四个小时）。驾驶距离 400 公里的，应当配备两名持有相应车型驾驶执照的司机。</view>
			<view class="mainRow">6) 司机应自行完成本合同项下的运输任务，司机应使用与运单中记载的一致的运输车辆进行运输，运输途中不得擅自变更车辆或委托托第三方运输，不得绕行、无故停车或从事与货物运输无关的活动。</view>
			<view class="mainRow">7) 司机应当根据运单要求按时到达指定装卸货地点完成装卸货，如司机延迟到达，发货人有权要求司机根据迟到时长赔偿损失，赔偿标准由双方协商确定。</view>
			<view class="mainRow">8) 若发货人需要回单，司机应在卸货完毕后及时将回单交付给发货人。</view>
			<view class="mainRow">9) 司机交货后，除因不可抗力、货物本身的自然性质造成的货物毁损或灭失的风险与损失以外，司机将货物交付收货方（以收货方签署的回单上记载的时间为准）之前发生的货物毁损或灭失的风险与损失由司机承担。司机造成发货人损失的，货运中国平台有权直接从司机支付的保证金中扣除损失金额作为给发货人的赔偿，不足部分由司机赔偿。</view>
			<view class="mainRow">10) 司机不得私自配货、倒卖货物或擅自拉走货物。</view>
			<view class="mainRow">3. 运费的支付</view>
			<view class="mainRow">3.1 发货人与司机应事先确认运费的总金额以及支付方式具体安排（如是否分为预付款、到付运费、回单付运费多期支付，以及分期支付的每一期金额等）。</view>
			<view class="mainRow">3.2 发货人应按照双方事先确认的运费的总金额、支付方式/时间（含现金、油卡、ETC卡）在货运中国平台相关页面如实、准确地填写；发货人在填写后，按本合同的约定及货运中国平台的相关规则支付运费，由双方线下支付。运费的支付及相关事宜，货运中国平台不参与相关事宜。</view>
			<view class="mainRow">3.3 运费结算的前提是货物已完成正常运输且不存在任何破损、丢失、延误等异常。</view>
			<view class="mainRow">3.4 司机如在运输产生货物损失或其他违约责任，货运中国平台有权在未结运费或保证金、押金中予以直接扣除赔偿款，不足部分有权另行向其追偿。</view>
			<view class="mainRow">3.5 双方已知悉并确认，货运中国平台运单记载的运费系全部运费，或双方协商约定并接受的运费内容。</view>
			<view class="mainRow">3.6 司机到达卸货目的地时或双方约定完成卸货后，发货人应将所有运输费用通过线下或线上的方式支付给司机。</view>
			<view class="mainRow">3.7 双方确认在使用货运中国平台服务用于实现运营收入，认可本产品服务所具有的经济价值并已充分理解本合同中有关货运中国平台服务费用及其他费用的收费约定，且已基于独立、理性的商业判断而选择同意接受本合同项下的收费约定。</view>
			<view class="mainRow">4. 发货人的其他权利义务</view>
			<view class="mainRow">4.1 发货人有义务向货运中国平台如实申报货物品名，保证托运的货物符合国家标准，在交付货物给司机前已完成有关法律、法规规定的托运手续，并附有效凭证。因违反本条合同或未办理相应的货物运输证件导致司机被相关政府部门罚款、扣车等情况导致司机发生损失的，由发货人全额赔偿。</view>
			<view class="mainRow">4.2 发货人承诺遵守《道路危险货物运输管理规定》和适用相关道路运输法律法规，不托运法律法规所禁止运输的货物，不托运危险货物、易燃易爆品或赃物。</view>
			<view class="mainRow">4.3 发货人承诺及保证托运货物包装符合国家或行业包装标准，已符合短途、长途运输的基本要求，可以抵抗运输过程中正常的摩擦、刹车、道路颠簸、搬运装卸承受力等。如货物因包装不合格导致损失，将自行承担责任。</view>
			<view class="mainRow">4.4 发货人确认，发货人有签订和履行本合同的资格和能力，并确保发货人提供的信息（包括但不限于，发货人信息、收货人信息、地址、电话、装货时间、到达收货时间、车型车长、体积重量）真实，准确，完整。</view>
			<view class="mainRow">4.5 货物发出前由发货人负责货物的装车工作，并进行封签操作，货物到达目的地后，由发货人或发货人指定收货人负责将货物卸货落地，如货物装卸过程中发生意外导致货物损失、人员意外伤害，责任由发货人承担。</view>
			<view class="mainRow">4.6 发货人确保及时安排运输车辆在装货地点装货，货物到达预定目的地后，必须立即通知收货人提货。若因未及时通知收货人，导致压车等待，需向司机支付压车等待费。</view>
			<view class="mainRow">4.7 收货方收货时，应比照运单当场对于货物数量与外表进行验收。除非存在因司机运输不当导致的货物数量短缺或损坏，否则应视为验收合格。</view>
			<view class="mainRow">4.8 直至货物送达至收货人，发货人有权在任何时候要求中止运输、变更货物目的地和收货人、退货等，但必须支付变更服务的额外运费及其它费用。</view>
			<view class="mainRow">4.9 发货人确认下单后，在您点击“确认用车”前，可无责取消运单。“确认用车”后，发货人不能无故取消运单，否则货运中国平台会扣除技术服务费。若发货人购买了平台服务货物保障，在发货人支付完违约金后退还增值服务费。</view>
			<view class="mainRow">4.10 发货人承诺下单发货时货物必须已经到达发货地点，并未在运输途中，货运中国平台不支持货物尚未到发货地点时先行安排车辆运输。如果货运中国平台后期发现发货人在货物仍在运输途中尚未到指定发货地点的时就提前在平台下单的，无论货运中国平台司机是否已接单或已收取相应运费，货运中国平台均不承该单货物所对应的运输风险。如途中发生包括但不限于货物丢失、破损、受潮、污染等情况，发货人与实际承运人自行沟通解决，与货运中国平台无关。</view>
			<view class="mainRow">4.11 发货人承诺在确实需要货物运输的情况下使用货运中国平台服务，不得通过虚构、伪造、与第三方串通以虚假形式发货下单。货运中国平台发现发货人处于上述任一情形，有权立即单方终止本合同，并要求其承担对货运中国平台造成的全部损失。如涉及犯罪，则货运中国平台会将其移交公安机关处理。</view>
			<view class="mainRow">4.12 发货人承诺货物装载不超载、超高、超宽。如有因货物装载超载、超高、超宽导致发生包括但不限于交通事故、政府罚款、货物破损、丢失等情形，发货人应承担全部责任。</view>
			<view class="mainRow">4.13 发货人知悉并同意，和收货人在签收货物前已仔细查验货物状态，确认包装及内物是否完好、完整。如发生发货人确认运单无异议后发现货物异常并要求货运中国平台赔偿的情况，货运中国平台不予赔偿。</view>
			<view class="mainRow">4.14 发货人应当在发布货物信息时核实货物信息。如果发布的货物信息不符合本合同的规定，货运中国平台保留要求其纠正、改进、删除或采取其他行动的权力。</view>
			<view class="mainRow">4.15 若货运中国平台先行垫付运费的，发货人有义务及时向货运中国平台支付相应的运输费用。</view>
			<view class="mainRow">4.16 发货人理解并同意，货运中国平台在运营过程中可能给其一定数量的优惠券，在任何情况下，优惠券不得用于提现。如优惠券有一定期限逾期未使用的，则视为放弃使用优惠券的权利。</view>
			<view class="mainRow">4.17 发货人理解并同意，货运中国平台安排第三方车辆及司机为您提供运输服务，不视为第三方司机系货运中国平台员工、代理人、雇员等。货运中国平台与第三方司机不存在任何法律关系（包括但不限于劳动关系、事实劳动关系、劳务关系、雇佣关系、代理关系等）。如发货人未通过货运中国平台私自委托第三方司机承运货物，由此产生的运输责任货运中国平台将不予承担。</view>
			<view class="mainRow">4.18 发货人知悉并同意，其有义务在货物出发后时刻关注货物运输状态，在货物交付给指定的收货人后，货运中国平台会发出消息供其核实货物签收情况。发货人应在货运中国平台向其发出消息后 24 小时内核实完毕，如发货人货物签收存在任何异常，请在 24 小时内通知货运中国平台，如发货人未及时反馈货物异常且未进行操作签收，则默认视为货物已正常签收，货运中国平台不存在任何违约行为。若发货人在接收到消息超过 24 小时后反馈货物异常，货运中国平台有权拒绝赔偿，由此造成的损失由发货人其自行承担。</view>
			<view class="mainRow">5. 司机的其他权利义务</view>
			<view class="mainRow">5.1 司机应确认并同意将其所有的用于提供货物运输服务的车辆与账号关联，司机将按照本合同及货运中国平台发布的其他规则管理其所有的车辆，享受货运中国平台服务。</view>
			<view class="mainRow">5.2 当货物起运后，司机开始承担运输责任，直到将货物安全运输至目的地且收货人正常签收完成后。在此期间，司机对货物的安全运输负全部责任。</view>
			<view class="mainRow">5.3 司机将货物运输至目的地后，必须要求收货人仔细检查货物情况。</view>
			<view class="mainRow">5.4 司机必须有合法的运输资质才可在货运中国平台提供车辆运输服务，且有资格且能够配备性能良好的、合适的车辆，提供及时、准确、安全、完整的符合货运中国平台预期的物流服务。</view>
			<view class="mainRow">5.5 司机必须按照国家规定投保机动车第三者责任险和交强险，商业险不低于 100 万，货物保险不低于 200 万。若其未办理货物运输保险或办理的货物运输保险不符合法律法规规定及本合同约定的，视为根本违约，货运中国平台有权立即终止合同。若因其未办理货物运输保险对货运中国平台及第三人造成损失，则应承担全部损失。司机必须确保所提供车辆的使用年限符合要求（国产车辆不超过 4 年，进口车辆不超过 6 年），如导致货物延误，则按照约定另行进行时效罚款。</view>
			<view class="mainRow">5.6 司机的年龄必须符合国家相关规定，并能保证持有与车辆类别相对应的合格机动车驾驶证。如您违反了上述条约，货运中国有平台权终止运单，不退还保证金。</view>
			<view class="mainRow">5.7 如司机竞价成功且对方确认用车后，拒绝提供车辆进行运输或延迟到达装货地，货运中国平台有权扣除司机的保证金。</view>
			<view class="mainRow">5.8 司机声明并保证，任何情况下不得以任何理由（包括但不限于扣押、留置发货人通过货运中国平台委托承运的货物，逾期 24 小时到达或司机失联 2 小时（含）或拒绝告知货物所在地即视为非法扣货），如发生上述情况，司机除应赔偿发货人全部货物价值以外，另应向货运中国平台支付 50 万元作为惩罚性违约金。如发货人损失超过违约金，则货运中国平台有权按照实际损失要求司机赔偿损失。您放弃任何关于调整违约金的抗辩权。</view>
			<view class="mainRow">5.9 司机未经发货人和货运中国平台同意不得擅自倒货、换车、配载及异地卸货，无论发货人的货物是否装满车厢，未经发货人和货运中国平台书面同意，不得私自夹带其他货物进行运输，每发生一次罚款 10000 元，货运中国平台将直接在运输费用中扣除。</view>
			<view class="mainRow">5.10 货物到达目的地后，如收货人拒收或找不到收货人时，司机必须尽快并（1 小时之内）通知货运中国平台并按照货运中国平台指示行动，不得擅自处置货物。</view>
			<view class="mainRow">5.11 当司机使用货运中国平台接单并接收货物时，必须仔细检查货物状态，如发现包装不符合或数量对方提供的不一致，应及时向对方提出。司机承运货物后，即视为认为货物适合运输，没有不合格的包装条件、货物不属于违禁品。如果在运输过程中出现异常，司机将赔偿全部损失，并放弃包装不合格、数量不符的抗辩权。</view>
			<view class="mainRow">5.12 司机在收取发货人货物时，在货物运输出发前，需要仔细检查车辆是否超载、超高等情况，如出现此情况，应立即向对方提出要求按照符合法律、法规规定执行。如司机承运货物后，发生因车辆超载、超高等情况被政府机关扣车、罚款或发生交通事故的，则司机承担全部责任。</view>
			<view class="mainRow">5.13 如在运输过程中发生火灾，司机必须在 1 小时内报警并通知货运中国平台及相应的保险公司，如因由于其没有及时报警或通知保险公司而造成损失扩大，将承担全部责任。司机应尽力防止货物损失扩大及保护好案发现场，直到保险公司勘查完毕为止。司机承诺已为运输车辆购买自燃险，在任何情况下，将对车辆发生火灾时造成的损害负责，货运中国平台不承担任何责任。</view>
			<view class="mainRow">5.14 司机车辆在运输过程中发生事故或异常（包括但不限于火灾、翻车、追尾等导致货物损坏、丢失、污染、受潮、变质等），则应按照货运中国平台赔偿发货人的金额向货运中国平台进行赔偿，并赔偿货运中国平台因处理事故产生的其他费用（包括但不限于短驳费、差旅费、交通费、住宿费、拖车费、运输费等）。还应在事故发生 30分钟内通知货运中国平台，并在 30 日内向货运中国平台提供以下信息：</view>
			<view class="mainRow">1) 事故现场照片:体现车牌号的整车照、事故情况；</view>
			<view class="mainRow">2) 货物受损照片:显示外包装损坏状态、内部货物损坏状态和破损数量（无法根据外观判断货物受损情况下一共品质标准或品质报告）；</view>
			<view class="mainRow">3) 运输证明:发货清单或装箱单、承运人驾驶证、车辆行驶证、交强险保单；</view>
			<view class="mainRow">4) 事故证明:签注货损货差的运单或交接单；</view>
			<view class="mainRow">5) 交警的事故责任认定书或消防责任认定书:如为交通事故的情况下；</view>
			<view class="mainRow">6) 公安出具的报案证明:偷盗/抢劫情况下；</view>
			<view class="mainRow">7) 弃置照片:如货物已完全损坏需要弃置的情况下，应体现弃置数量及弃置后的状态；</view>
			<view class="mainRow">8) 理赔金额在 1000 元以下的，要求在 3 个工作日内处理完毕；</view>
			<view class="mainRow">5.15 司机承运货运中国平台上发货人方货物后，若在运输过程中发生包括但不限于交通事故、着火、被盗、被抢等导致货物发生包括但不限于货物灭失、丢失、损坏、污染、受潮、变质等致使发货人遭受损失的，司机应按照货运中国平台赔偿给发货人的金额或发货人索赔的金额或货物实际损失的价值予以赔偿。货运中国平台有权先行在其未结运费中扣除相应的损失，不足部分由货运中国平台向其主张索赔。司机另需承担货运中国平台维权过程中产生的包括但不限于律师费、材料费、诉讼费、公证费、保全费、交通费、住宿费等损失。</view>
			<view class="mainRow">5.16 若由于交通事故所发生的一切费用和损失及涉及第三人的赔偿全部由司机自行承担，在处理事故中司机的赔偿不足，货运中国平台有权扣留其未结运费、保证金用于赔偿费用。</view>
			<view class="mainRow">5.17 司机在合同期间及合同结束后 3 年内，未经货运中国平台书面许可，不得直接或间接与货运中国平台发货人进行交易，如违反本条约定，则应赔偿货运中国平台 50 万元违约金，若货运中国平台损失高于违约金，则有权要求您按照实际损失包括货运中国平台但不限于在货运中国平台发货人处的预期收益等赔偿。</view>
			<view class="mainRow">5.18 货运中国平台无权管理和控制司机自愿投入的运输车辆，该运输车辆完全由您支配，所有的管理费用由其承担且对该运输车辆的营运享有完全的收益。若司机投入的运输车辆因交通事故或其他事故对第三方造成人身伤害或财产损失的，司机承担全部法律责任，货运中国平台不负任何法律责任。</view>
			<view class="mainRow">5.19 司机通过货运中国平台运输货物，并不意味着存在劳动关系或事实劳动关系、雇佣关系等，如果在运输服务过程中发生自身或导致货运中国平台及第三方人身或财产损害，司机应负责妥善处理并承担全部责任。</view>
			<view class="mainRow">5.20 货物进入运输阶段后，司机应按照运输合同内要求在规定时间内完成货物运输，保证货物处于安全状态。在货物运输过程中，因运输行为造成的损失，由其承担全部法律责任。</view>
			<view class="mainRow">5.21 司机须确保运输车辆是可以提供货物运输服务的货运车辆，包括但不限于车辆状况适于提供运输服务、无交通事故隐患、车况正常（非改装车及部件）。如在司机提供货物运输服务的过程中，发生车辆不符合货物运输资质或不适合货物运输的情况，必须立即停止提供货物运输服务并取消货物运输交易，发货人和货运中国平台亦有权直接取消运单。如在货物运输过程中因发生货物灭失或人员伤亡的，司机应及时与保险公司联系偿付事宜，并通知发货人、货运中国平台。</view>
			<view class="mainRow">5.22 司机应向货运中国平台提供身份证、驾驶证复印件、运输从业资格证及相关资质证照等信息或证明资料，且该信息或证明资料及司机通过货运中国平台发布的全部信息均应持续性地保持真实、准确、完整、合法、有效，不会损害货运中国平台的利益及第三方的合法权益。如未提供上述信息或司机通过货运中国平台发布的信息不实，货运中国平台有权拒绝其使用本产品。</view>
			<view class="mainRow">5.23 司机向货运中国平台提供、上传、发布运输提供方信息（包括但不限于司机、承运车辆的信息等）均与实际提供货物运输服务的信息（包括但不限于司机、承运车辆的信息等）一致。如果存在任何不一致的情况，发货人和货运中国平台有权单方取消运单，并扣除部分保证金。</view>
			<view class="mainRow">5.24 司机必须按照适用的道路安全法律法规驾驶，不疲劳驾驶、不酒驾、不醉驾、不毒驾，保证货物安全及人身安全（包括但不限于您提供货物运输服务时的连续驾驶时间不得超过四个小时）。驾驶距离 400 公里的，应当配备两名持有相应车型驾驶执照的司机。</view>
			<view class="mainRow">5.25 司机理解并同意，通过注册成为货运中国平台用户后，并不意味着货运中国平台必须委托运输货物给司机，也不保证其在货运中国平台上承运货量、次数、运费收入等。</view>
			<view class="mainRow">5.26 司机保证运输服务在货运中国平台发货人规定的期限内完成，如司机延迟到达目的地，发货人和货运中国平台有权向其提出索赔。</view>
			<view class="mainRow">5.27 司机理解并同意，在运输货运中国平台发货人方货物时，如果货运中国平台发货人有要求进行封签码扫描、上传委托书或安装其他 App 来监控货物的安全，则司机必须按照对方要求进行操作，如操作不合规或未操作则发货人有权不予支付该趟运输费用。</view>
			<view class="mainRow">5.28 发货人应按照本合同及运单上的价格向司机支付相应的运输费用。</view>
			<view class="mainRow">5.29 司机必须承担所有因道路限行、交通管理条例、交通管制措施、非法资质（包括但不限于没有道路运输经营许可证、营运证或从业资格证）、运输违禁品而产生的行政责任（包括但不限于行政处罚、刑事责任），因被有关主管部门扣押运输车辆或运输货物及由此造成的全部损失（包括但不限于因被扣押运输车辆或运输货物而给发货人、货运中国平台造成的全部损失），货运中国平台不承担任何相关责任。</view>
			<view class="mainRow">5.30 货运中国平台提供的定位功能是采用运营商的基站位置信息，由于通信信号等多种因素，货运中国平台无法保证司机使用的连贯性以及位置的精准性。</view>
			<view class="mainRow">6.违约责任</view>
			<view class="mainRow">6.1 双方应当遵守国家法律、行政法规、部门规章及相关规范性文件的规定，遵守货运中国平台货物运输交易秩序，不得损害其他易一方权益，如违反本规则或货运中国平台其他合同或规则的，货运中国平台将根据相关规则对其违规行为进行处理。</view>
			<view class="mainRow">6.2 双方在通过货运中国平台进行货物运输交易过程中，如发生双方产生任何争议或纠纷，应本着公平、诚信的原则进行友好、理性的协商。如争议无法自行解决，任何一方向货运中国平台投诉，货运中国平台将按照平台争议及相关规则处理。</view>
			<view class="mainRow">6.3 货运中国平台过将依据以下证据认定纠纷相关事实；</view>
			<view class="mainRow">（1)双方在货运中国平台签署的运输合同；</view>
			<view class="mainRow">（2) 司机在货运中国平台形成的运单信息；</view>
			<view class="mainRow">（3) 发货人在货运中国平台发布的货源信息；</view>
			<view class="mainRow">（4) 双方在货运中国平台显示的支付信息；</view>
			<view class="mainRow">（5) 双方使用货运中国平台聊天工具 IM 产生的聊天记录；</view>
			<view class="mainRow">（7) 双方提供的其他证据。</view>
			<view class="mainRow">6.4 针对发货人的违约行为货运中国平台有权对其进行违约处理，处理方式包括：扣除保证金，归入交易黑名单，甚至终止交易资格。其他违约处理方式参照相关的合同条款执行。</view>
			<view class="mainRow">6.5 双方应严格按照运单及运输合同约定履行相应义务，未违反货运中国平台各项合同及规则，因交易对方违约产生损失的，货运中国平台介入后交易对方仍拒不赔付的，货运中国平台将根据相关规则向符合条件的一方先行垫付相应款项，再向责任方追偿。</view>
			<view class="mainRow">7 责任免除和不可抗力</view>
			<view class="mainRow">7.1 双方理解，货运中国平台需要定期或不定期对服务相关设备进行检修或维护，如因此类情况而造成的损失，货运中国平台无需为此承担任何责任，但货运中国平台将事先进行通告。</view>
			<view class="mainRow">7.2 双方在使用货运中国平台服务时，应更新至最新版本，否则货运中国平台将不保证其能正常使用相关服务。如果双方从未经货运中国平台授权的第三方获取软件，货运中国平台无法保证该软件能够正常使用，由此造成的相关损失，货运中国平台不予负责。</view>
			<view class="mainRow">7.3 双方理解并同意货运中国平台将会尽其商业上的合理努力保障用户在货运中国平台服务中的数据存储安全，但是，货运中国平台并不能就此提供保证。</view>
			<view class="mainRow">7.4 双方理解并同意，货运中国平台的服务是按照现有技术和条件所能达到的现状提供的。货运中国平台会尽最大努力向双方提供服务，确保服务的连贯性和安全性；但货运中国平台不能随时预见和防范法律、技术以及其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵、政府行为、政策等原因可能导致的服务中断、数据丢失以及其他的损失和风险。出现上述情况时，货运中国平台将努力及时进行修复，但是由此给双方造成的损失，货运中国平台在法律允许的范围内免责。</view>
			<view class="mainRow">7.5 在法律允许的范围内，货运中国平台对以下情形导致的服务中断或受阻或者任何资料在产生或在传送过程中产生的延误、不准确、错误或遗漏不承担任何责任：</view>
			<view class="mainRow">a) 受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏；</view>
			<view class="mainRow">b) 货运中国平台的电脑软件、系统、硬件和通信线路出现故障；</view>
			<view class="mainRow">c) 双方操作不当；</view>
			<view class="mainRow">d) 双方通过非货运中国平台授权的方式使用本服务；</view>
			<view class="mainRow">e) 其他货运中国平台无法控制或合理预见的情形。</view>
			<view class="mainRow">7.6 双方理解并同意，在使用本服务的过程中，可能会遇到网络信息或其他用户行为带来的风险，货运中国平台不对任何信息的真实性、适用性、合法性承担责任，也不对因侵权行为给双方造成的损害负责。这些风险包括但不限于：</view>
			<view class="mainRow">a) 来自他人匿名或冒名的含有威胁、诽谤、令人反感或非法内容的信息；</view>
			<view class="mainRow">b) 因使用本合同项下的服务，遭受他人误导、欺骗或其他导致或可能导致的任何心理、生理上的伤害以及经济上的损失；</view>
			<view class="mainRow">c) 其他因网络信息或用户行为引起的风险。</view>
			<view class="mainRow">7.7 如双方违反相关法律法规或本合同的约定，或货运中国平台按照法律规定或主管部门的要求，货运中国平台有权不经通知而中断或终止向其提供服务。</view>
			<view class="mainRow">7.8 货运中国平台依据本合同约定获得处理违法违规内容的权利，该权利不构成货运中国平台的义务或承诺，货运中国平台不能保证及时发现违法行为或进行相应处理。</view>
			<view class="mainRow">7.9 在任何情况下，双方不应轻信借款、索要账号、验证码或其他涉及财产的网络信息。涉及财产操作的，请一定先核实对方身份，谨慎处理。</view>
			<view class="mainRow">7.10 货运中国平台仅提供本服务，并不参与具体的服务交易，双方使用本服务时，因服务交易本身以及您与任何第三方所产生的任何纠纷或责任，应由其自行解决并承担全部责任。</view>
			<view class="mainRow">7.11 司机应当自行承担所有因道路限行、交通管理规定、交通管制措施引起的行政责任（包括但不限于行政处罚）以及由此造成的任何直接、间接损失（包括但不限于给发货人造成的损失），货运中国平台不承担相关责任。</view>
			<view class="mainRow">7.12 货运中国平台所提供的定位功能，是采用运营商的基站位置信息，由于通信信号等多种因素，货运中国平台不保证用户使用的连贯性以及位置精准性。</view>
			<view class="mainRow">7.13 双方在使用本服务的过程中，货运中国平台在法律规定的范围内可处理违法违规内容，但不构成货运中国平台的义务或承诺。</view>
			<view class="mainRow">7.14 发货人理解并同意，司机对下列事项不承担责任：</view>
			<view class="mainRow">1) 因不可抗力(包括但不限于自然灾害、台风、政府行为、战争、疫情等社会异常事件)带来的相关损失。</view>
			<view class="mainRow">2) 货物的自然性质、质量缺陷以及货物的合理损耗。</view>
			<view class="mainRow">3) 发货人自行包装、装卸，货运中国平台在货物运输途中未发生交通事故等易导致货物损坏的承运过失，因包装容器不良或装载不良造成的损失。</view>
			<view class="mainRow">4) 发货人在托运货物中夹带国家禁止运输、缺少相关手续的限制运输物品和危险品造成的损失。</view>
			<view class="mainRow">5) 因发货人或收货人过错造成的损失。</view>
			<view class="mainRow">6) 承运过程中可能发生的一切间接损失（包括但不限于对所托运货物的违约金、收益、利润、实际用途、特殊商业价值）。</view>
			<view class="mainRow">7) 运输过程中封签或铅锭完好，车厢内内物短少、丢失的；或外包装完好，内部破损或丢失的。</view>
			<view class="mainRow">8 附则</view>
			<view class="mainRow">8.1 合同解释权属于货运中国平台。</view>
			<view class="mainRow">8.2 合同拟定、修改、公告必须按货运中国平台有关程序执行，货运中国平台将事先通过公告、系统消息、手机短信等通知用户，规则自生效日起，在有效期内，双方必须遵守。</view>
			<view class="mainRow">8.3 本合同以电子版本签订，发货人点击“确认用车”后生效，对发货人、司机均有法律约束力。</view>
			<view class="mainRow">8.4 本合同电子版签订成立后，在货运中国平台系统内留存有效期 3 年。</view>
			<view class="mainRow">8.5 鉴于货运中国平台仅为司机与发货人双方提供运输交易的平台，发货人方发布的信息未经货运中国平台事先审查，因此货运中国平台无法保证其内容的真实性、准确性、完整性、有效性和安全性。双方自行确保其通过货运中国平台填写、确认、提供及生成的信息真实、准确、有效性，因此货运中国平台不承担任何责任。因发货人与司机在本合同项下的货物运输交易或相关事宜产生纠纷、义务、责任，或涉及到任何第三方之间发生的纠纷义务、责任，应由发货人和司机自行解决并承担全部义务和责任。任何一方不得因上述纠纷或责任向货运中国平台提出任何主张要求、诉讼、仲裁或其他法律程序，且不得因此导致货运中国平台承担任何义务和责任遭受任何损失。货运中国平台可选择尽可能的为发货人和司机提供协助，促使双方进行良好沟通，妥善解决争议，但不构成货运中国平台的任何义务。如因本合同的任何事宜，发货人/司机的任何行为直接或间接造成货运中国平台损失的，发货人/司机应连带赔偿货运中国平台的全部损失（包括但不限于直接与间接的经济损失、商誉损失及对外的赔偿金、和解金、调查费、公证费、保全费、律师费、诉讼费以及其他因索赔而发生的费用等）。</view>
			<view class="mainRow">8.6 双方确认，货运中国平台有权根据业务运营的调整，随时修改和变更本合同，货运中国平台通过平台发布最新的运输合同，将不另作个别通知，若用户不同意上述对本合同相关条款作出修改或变更，应停止使用本合同项下的所述服务，若一方于本合同发生任何修改或变更后继续使用本合同项下的服务，则视为该方已阅读、了解并同意上述修改或变更也将遵守修改、变更后的合同内容使用服务。</view>
			<view class="mainRow">8.7 本合同未尽事宜，由双方协商解决。凡由本合同引起或与本合同有关的所有争议，应友好协商解决，若协商不成的， 可向货运中国平台所在地有管辖权的人民法院提起诉讼解决。</view>
		</view>
		</view>
	</view>
</template>

<script>
	import * as utils from "@/utils/ship.js";
	export default {
		data() {
			return {
				senderUserName: '',
				userInfo: {},
				handingRequiredVal: [],
				requiredValText: '',
				taskId: '',
				contractObj: {},
				userRole: 0,
				startAddress1: {},
				// 联系人
				defaultContact: {},
				contactUser: {
					user1: {},
					user2: {},
					user3: {},
					user4: {},
				},
				// 信息费
				infoPrice: '',
				needReceipt: false,
				quoteDetails: {},
				quotationWay: '',
				informationFlag: ''
			};
		},
		onLoad(options) {
			var that = this;
			var userInfo = uni.getStorageSync("userInfo");
			this.userRole = uni.getStorageSync("userRole");
			console.log(this.userRole);
			that.userInfo = JSON.parse(userInfo);
			that.taskId = options.taskId;
			if(that.taskId){
				that.getContract();
			} else {
				that.getHandingRequired();
				that.handingRequiredVal = getApp().globalData.orderOtherData.handingRequiredVal ? getApp().globalData.orderOtherData.handingRequiredVal : this.handingRequiredVal;
				this.startAddress1 = getApp().globalData.addressObject.loadGoods1;
				this.endAddress1 = getApp().globalData.addressObject.unloadGoods1;
				this.startAddress2 = getApp().globalData.addressObject.loadGoods2;
				this.endAddress2 = getApp().globalData.addressObject.unloadGoods2;
				// 联系人
				this.defaultContact = getApp().globalData.defaultContact;
				this.contactUser = getApp().globalData.contactUser;
				this.infoPrice = getApp().globalData.orderOtherData.infoPrice ? getApp().globalData.orderOtherData.infoPrice : this.infoPrice;
				this.needReceipt = getApp().globalData.orderOtherData.needReceipt ? getApp().globalData.orderOtherData.needReceipt : this.needReceipt;
				let costInformation = getApp().globalData.costInformation;
				// console.log('费用信息', costInformation);
				this.quotationWay = options.quoteDetails ? JSON.parse(options.quoteDetails).fixPriceFlag : costInformation.quotationWay;
				this.informationFlag = options.quoteDetails ? JSON.parse(options.quoteDetails).informationFlag : costInformation.informationFlag;
				console.log(options)
				if(options.quoteDetails){
					console.log(options.quoteDetails);
					this.quoteDetails = JSON.parse(options.quoteDetails);
					if(getApp().globalData.loadTimeData.loadTimeObj3.startTime){
						this.quoteDetails.loadTimeObj3 = getApp().globalData.loadTimeData.loadTimeObj3;
					}
					if(getApp().globalData.loadTimeData.loadTimeObj1.startTime){
						console.log(getApp().globalData.loadTimeData.loadTimeObj1)
						let startDt = getApp().globalData.loadTimeData.loadTimeObj1.startTime;
						startDt = startDt.replace(/年/, '-');
						startDt = startDt.replace(/月/, '-');
						startDt = startDt.replace(/日/, '');
						let endDt = getApp().globalData.loadTimeData.loadTimeObj1.endTime;
						endDt = endDt.replace(/年/, '-');
						endDt = endDt.replace(/月/, '-');
						endDt = endDt.replace(/日/, '');
						this.quoteDetails.loadTimeObj1 = {startTime: startDt, endTime: endDt}
						console.log(this.quoteDetails)
					}
				}
			}
		},
		methods:{
			setPrice(num){
				console.log(num);
				if(!num) return 0;
				var num = Number(num)
				var price =  Math.floor(num * 100) / 100;
				console.log(price, num);
				var newPrice;
				if(num.toString().indexOf('.') == -1){
					newPrice = price + '.00'
				} else {
					var numArr = price.toString().split('.')
					console.log(numArr);
					if(numArr[1].length==1){
						newPrice = price + '0'
					} else if (numArr[1].length==2) {
						newPrice = price
					}
				}
				return newPrice;
			},
			getContract(){
				var that = this;
				utils.postRequest('/transport/contract/getContract?taskId=' + that.taskId, {}, "GET")
				.then(res=>{
					console.log(res)
					if(res.retCode == "0000000"){
						that.contractObj = res.rspBody?res.rspBody:{};
						that.quotationWay = that.contractObj.fixPriceFlag;
						that.informationFlag = that.contractObj.informationFlag;
						var shipperComName = res.rspBody.shipperComName;
						var senderUserName = res.rspBody.senderUserName;
						if (shipperComName) {
							that.senderUserName = res.rspBody.shipperComName +'(' + res.rspBody.senderUserName +')'
						} else {
							that.senderUserName = res.rspBody.senderUserName
						}
						
					} else{
						uni.showToast({
							title: res.retDesc,
							icon: 'none'
						})
					}
					console.log(res)
				})
				.catch(err=>{
					console.log(err)
				})
			},
			getHandingRequired() { // 获取装载要求
				let that = this;
				utils.postRequest('/ts/goods/handingRequired/get')
				.then(res=>{
					// console.log('装载要求', res);
					that.handingRequiredAry = res.rspBody.items;
					console.log(that.handingRequiredAry);
					that.requiredValText = that.showHandingRequiredMsg()?that.showHandingRequiredMsg():'';
				})
				.catch(err=>{
					console.log(err);
				})
			},
			showHandingRequiredMsg() { // 展示装卸要求
				if(this.handingRequiredVal.length == 0) {
					return false;
				}else {
					let msg = '';
					for(let i in this.handingRequiredAry) {
						for(let a in this.handingRequiredVal) {
							if(this.handingRequiredVal[a] == this.handingRequiredAry[i].sid) {
								msg = msg + this.handingRequiredAry[i].typeName + '、'
							}
						}
					}
					return msg.slice(0, msg.length - 1);
				}
			},
		}
	}
</script>

<style lang="scss">
	page{		
		background-color: #F3F3F3;
	}
	.all-box{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.table{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.table-box{
				width: 700rpx;
				border-top: 3rpx solid #333;
				border-left: 3rpx solid #333;
				margin-top: 30rpx;
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
				.table-row{
					border-right: 3rpx solid #333;
					border-bottom: 3rpx solid #333;
					padding: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.table-row1{
					display: flex;
					align-items: center;
					border-bottom: 3rpx solid #333;
					.deliver-goods{
						width: 70rpx;
						height: 250rpx;
						line-height: 40rpx;
						padding: 0 10rpx;
						box-sizing: border-box;
						display: flex;
						text-align: center;
						align-items: center;
						justify-content: center;
						border-right: 3rpx solid #333;
					}
					.deliver-goods-content{
						width: 280rpx;
						height: 250rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						border-right: 3rpx solid #333;
						word-wrap:break-word; 
						word-break:break-all; 
					}
				}
				.table-row2{
					display: flex;
					align-items: center;
					border-right: 3rpx solid #333;
					border-bottom: 3rpx solid #333;
					padding: 20rpx;
				}
				
			}
		}
		.mainContent{
			width: 700rpx;
			.mainRow{
				font-size:28rpx;
				color:#333;
				line-height: 40rpx;
				text-indent:30rpx;
			}
		}
	}
</style>
