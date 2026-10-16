export const lightColors = {
  primary: '#111111', primaryDark: '#000000', accent: '#D4AF37',
  background: '#F8F7F2', surface: '#FFFFFF', surfaceMuted: '#F1EFE6',
  text: '#111111', secondaryText: '#6B675D', border: '#DED9C8',
  success: '#2F7D5B', danger: '#B53B49', warning: '#A67C00',
  tabBar: '#FFFFFF', shadow: '#000000',
};

export const darkColors = {
  primary: '#111111', primaryDark: '#000000', accent: '#D4AF37',
  background: '#090909', surface: '#151515', surfaceMuted: '#222222',
  text: '#F7F5ED', secondaryText: '#C9C4B7', border: '#38362F',
  success: '#69B98E', danger: '#FF7B89', warning: '#E0B83F',
  tabBar: '#0F0F0F', shadow: '#000000',
};

export const categoryColors = {
  Starters: '#A8841A', Mains: '#111111', Desserts: '#D4AF37', Drinks: '#4E4A3E',
};

export const formatCurrency = (amount) =>
  `Rs. ${Math.round(Number(amount) || 0).toLocaleString('en-PK')}`;
