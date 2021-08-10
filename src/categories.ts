import Category from './interface/Category';

const categories: Category[] = [
  {
    name: '飲食',
    icon: '🍜',
    color: '#fff',
    subCategories: ['早餐', '午餐', '晚餐', '點心', '飲料', '酒類', '水果', '宵夜']
  },
  {
    name: '交通',
    icon: '🚗',
    color: '#fff',
    subCategories: ['加油費', '停車費', '火車', '計程車', '捷運', '公車', '單車', '摩托車']
  },
  {
    name: '娛樂',
    icon: '🎤',
    color: '#fff',
    subCategories: ['電影', '遊樂園', '展覽', '影音', '音樂', '遊戲', '運動', '博弈', '消遣', '健身']
  },
  {
    name: '購物',
    icon: '🎁',
    color: '#fff',
    subCategories: ['市場', '衣物', '鞋子', '配件', '包包', '美妝保養', '精品', '禮物', '電子產品',
      '應用軟體']
  },
  {
    name: '個人',
    icon: '👤',
    color: '#fff',
    subCategories: ['社交', '通話費', '借款', '投資', '稅金', '保險', '捐款', '寵物', '彩券']
  },
  {
    name: '醫療',
    icon: '💉',
    color: '#fff',
    subCategories: ['門診', '牙齒保健', '藥品']
  },
  {
    name: '家居',
    icon: '🏠',
    color: '#fff',
    subCategories: []
  },
  {
    name: '家庭',
    icon: '👪',
    color: '#fff',
    subCategories: []
  },
  {
    name: '生活',
    icon: '🕯️',
    color: '#fff',
    subCategories: []
  },
  {
    name: '學習',
    icon: '📖',
    color: '#fff',
    subCategories: []
  },
  {
    name: '其他',
    icon: '🤔️',
    color: '#fff',
    subCategories: []
  },
];

export default categories;

