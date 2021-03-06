import Category from '../interface/Category';

const categories: Category[] = [
  {
    name: '飲食',
    icon: '🍜',
    color: 'rgb(239,196,139)',
    subCategories: ['早餐', '午餐', '晚餐', '點心', '飲料', '酒類', '水果', '宵夜']
  },
  {
    name: '交通',
    icon: '🚗',
    color: 'rgb(57,136,218)',
    subCategories: ['加油費', '停車費', '火車', '計程車', '捷運', '公車', '單車', '摩托車']
  },
  {
    name: '娛樂',
    icon: '🎤',
    color: 'rgb(144,98,182)',
    subCategories: ['電影', '遊樂園', '展覽', '影音', '音樂', '遊戲', '運動', '博弈', '消遣', '健身']
  },
  {
    name: '購物',
    icon: '🎁',
    color: 'rgb(200,107,107)',
    subCategories: ['市場', '衣物', '鞋子', '配件', '包包', '美妝保養', '精品', '禮物', '電子產品',
      '應用軟體']
  },
  {
    name: '個人',
    icon: '👤',
    color: 'rgb(162,159,140)',
    subCategories: ['社交', '通話費', '借款', '投資', '稅金', '保險', '捐款', '寵物', '彩券']
  },
  {
    name: '醫療',
    icon: '💉',
    color: 'rgb(238,73,75)',
    subCategories: ['門診', '牙齒保健', '藥品', '醫療用品', '打針', '住院', '手術', '健康檢查']
  },
  {
    name: '家居',
    icon: '🏠',
    color: 'rgb(66,86,108)',
    subCategories: ['日常用品', '水費', '電費', '燃料費', '電話費', '網路費', '房租', '洗衣費', '修繕費',
      '家具', '訂閱', '家電',]
  },
  {
    name: '家庭',
    icon: '👪',
    color: 'rgb(226,173,211)',
    subCategories: ['生活費', '教育', '看護', '玩具', '才藝',]
  },
  {
    name: '生活',
    icon: '🕯️',
    color: 'rgb(106,127,91)',
    subCategories: ['美容美髮', '泡湯', '按摩', '住宿', '旅行', '派對',]
  },
  {
    name: '學習',
    icon: '📖',
    color: 'rgb(243,153,91)',
    subCategories: ['書籍', '課程', '教材', '證書', '探索', '文具', '咖啡廳', '紅包',]
  },
  {
    name: '其他',
    icon: '🤔️',
    color: 'rgb(96,87,131)',
    subCategories: ['其他']
  },
  {
    name: '收入',
    icon: '💰',
    color: 'rgb(154,126,90)',
    subCategories: ['薪水', '獎金', '生活費']
  },

];

export const subCategories = [{'category': '飲食', 'name': '早餐', 'icon': ''},
  {'category': '飲食', 'name': '午餐', 'icon': '🍕'},
  {'category': '飲食', 'name': '晚餐', 'icon': '🍜'},
  {'category': '飲食', 'name': '點心', 'icon': '🍰'},
  {'category': '飲食', 'name': '飲料', 'icon': '🥤'},
  {'category': '飲食', 'name': '酒類', 'icon': '🍺'},
  {'category': '飲食', 'name': '水果', 'icon': '🍉'},
  {'category': '飲食', 'name': '宵夜', 'icon': '🍢'},
  {'category': '交通', 'name': '加油費', 'icon': '⛽️'},
  {'category': '交通', 'name': '停車費', 'icon': '🅿️'},
  {'category': '交通', 'name': '火車', 'icon': '🚄'},
  {'category': '交通', 'name': '計程車', 'icon': '🚕'},
  {'category': '交通', 'name': '捷運', 'icon': '🚇'},
  {'category': '交通', 'name': '公車', 'icon': '🚌'},
  {'category': '交通', 'name': '單車', 'icon': '🚴'},
  {'category': '交通', 'name': '摩托車', 'icon': '🏍️'},
  {'category': '娛樂', 'name': '電影', 'icon': '🎤'},
  {'category': '娛樂', 'name': '遊樂園', 'icon': '🎠'},
  {'category': '娛樂', 'name': '展覽', 'icon': '🎨'},
  {'category': '娛樂', 'name': '影音', 'icon': '🎬'},
  {'category': '娛樂', 'name': '音樂', 'icon': '🎵'},
  {'category': '娛樂', 'name': '遊戲', 'icon': '🎮'},
  {'category': '娛樂', 'name': '運動', 'icon': '🏀'},
  {'category': '娛樂', 'name': '博弈', 'icon': '🎲'},
  {'category': '娛樂', 'name': '消遣', 'icon': ''},
  {'category': '娛樂', 'name': '健身', 'icon': ''},
  {'category': '購物', 'name': '市場', 'icon': ''},
  {'category': '購物', 'name': '衣物', 'icon': ''},
  {'category': '購物', 'name': '鞋子', 'icon': ''},
  {'category': '購物', 'name': '配件', 'icon': ''},
  {'category': '購物', 'name': '包包', 'icon': ''},
  {'category': '購物', 'name': '美妝保養', 'icon': ''},
  {'category': '購物', 'name': '精品', 'icon': ''},
  {'category': '購物', 'name': '禮物', 'icon': ''},
  {'category': '購物', 'name': '電子產品', 'icon': ''},
  {'category': '購物', 'name': '應用軟體', 'icon': ''},
  {'category': '個人', 'name': '社交', 'icon': ''},
  {'category': '個人', 'name': '通話費', 'icon': ''},
  {'category': '個人', 'name': '借款', 'icon': ''},
  {'category': '個人', 'name': '投資', 'icon': ''},
  {'category': '個人', 'name': '稅金', 'icon': ''},
  {'category': '個人', 'name': '保險', 'icon': ''},
  {'category': '個人', 'name': '捐款', 'icon': ''},
  {'category': '個人', 'name': '寵物', 'icon': ''},
  {'category': '個人', 'name': '彩券', 'icon': ''},
  {'category': '醫療', 'name': '門診', 'icon': ''},
  {'category': '醫療', 'name': '牙齒保健', 'icon': ''},
  {'category': '醫療', 'name': '藥品', 'icon': ''},
  {'category': '醫療', 'name': '醫療用品', 'icon': ''},
  {'category': '醫療', 'name': '打針', 'icon': ''},
  {'category': '醫療', 'name': '住院', 'icon': ''},
  {'category': '醫療', 'name': '手術', 'icon': ''},
  {'category': '醫療', 'name': '健康檢查', 'icon': ''},
  {'category': '家居', 'name': '日常用品', 'icon': ''},
  {'category': '家居', 'name': '水費', 'icon': ''},
  {'category': '家居', 'name': '電費', 'icon': ''},
  {'category': '家居', 'name': '燃料費', 'icon': ''},
  {'category': '家居', 'name': '電話費', 'icon': ''},
  {'category': '家居', 'name': '網路費', 'icon': ''},
  {'category': '家居', 'name': '房租', 'icon': ''},
  {'category': '家居', 'name': '洗衣費', 'icon': ''},
  {'category': '家居', 'name': '修繕費', 'icon': ''},
  {'category': '家居', 'name': '家具', 'icon': ''},
  {'category': '家居', 'name': '訂閱', 'icon': ''},
  {'category': '家居', 'name': '家電', 'icon': ''},
  {'category': '家庭', 'name': '生活費', 'icon': ''},
  {'category': '家庭', 'name': '教育', 'icon': ''},
  {'category': '家庭', 'name': '看護', 'icon': ''},
  {'category': '家庭', 'name': '玩具', 'icon': ''},
  {'category': '家庭', 'name': '才藝', 'icon': ''},
  {'category': '生活', 'name': '美容美髮', 'icon': ''},
  {'category': '生活', 'name': '泡湯', 'icon': ''},
  {'category': '生活', 'name': '按摩', 'icon': ''},
  {'category': '生活', 'name': '住宿', 'icon': ''},
  {'category': '生活', 'name': '旅行', 'icon': ''},
  {'category': '生活', 'name': '派對', 'icon': ''},
  {'category': '學習', 'name': '書籍', 'icon': ''},
  {'category': '學習', 'name': '課程', 'icon': ''},
  {'category': '學習', 'name': '教材', 'icon': ''},
  {'category': '學習', 'name': '證書', 'icon': ''},
  {'category': '學習', 'name': '探索', 'icon': ''},
  {'category': '學習', 'name': '文具', 'icon': ''},
  {'category': '學習', 'name': '咖啡廳', 'icon': ''},
  {'category': '學習', 'name': '紅包', 'icon': ''},
  {'category': '其他', 'name': '其他', 'icon': ''},
  {'category': '收入', 'name': '獎金', 'icon': ''},
  {'category': '收入', 'name': '薪水', 'icon': ''},
  {'category': '收入', 'name': '生活費', 'icon': ''},

];

export default categories;

