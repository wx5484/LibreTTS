export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    const provided = req.body.password;
    const envPass = process.env.PASSWORD || '';
    
    if (!envPass) {
      return res.status(400).json({ valid: false, error: '未设置系统密码' });
    }
    
    if (!provided || provided.trim() === '') {
      return res.status(400).json({ valid: false, error: '请输入密码' });
    }
    
    if (provided === envPass) {
      return res.status(200).json({ valid: true, message: '验证成功' });
    } else {
      console.warn(`[安全] 密码验证失败 - IP: ${req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || 'unknown'}`);
      return res.status(401).json({ valid: false, error: '密码错误' });
    }
  }
  return res.status(405).json({ error: '不支持的请求方法' });
}
