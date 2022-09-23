import gdown

def get_model():
    url = 'https://drive.google.com/uc?id=1gey4GJSd5aClitbg_GAM_tcDLjMLiNDB'
    output = 'models/'
    gdown.download(url,output,quiet=False)
