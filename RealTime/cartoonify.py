# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torch.nn.functional as F

import utils
from models.generator import Generator

import numpy as np
import gc
import cv2
import matplotlib.pyplot as plt
import os


# %%
device = 'cuda' if torch.cuda.is_available() else  'cpu'
print(device)


# %%
model_path = r'../ImagesCartoonify/checkpoints/trained_netG.pth'
generator = Generator().to(device)

generator.load_state_dict(torch.load(model_path,map_location=torch.device(device)))


# %%
preprocess = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

inv_normalize = transforms.Normalize(
    mean=[-0.485/0.229, -0.456/0.224, -0.406/0.255],
    std=[1/0.229, 1/0.224, 1/0.255]
)


# %%
print('Init WebCam...')
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

print('Start cartoonifying...')
while(True):
    _, frame_np = cap.read()
    frame_np = cv2.cvtColor(frame_np, cv2.COLOR_BGR2RGB)
    frame_np = cv2.resize(frame_np, (910, 512), cv2.INTER_AREA)
    frame_np = frame_np[:, 120:792, :]
    frame_np = cv2.flip(frame_np, 1)
    tensor_img = preprocess(frame_np).unsqueeze(0).to(device)
    generator.eval()
    with torch.no_grad():
        pred = generator(tensor_img)
    generator.train()
    pred = inv_normalize(pred).squeeze(0).permute(1,2,0).cpu().numpy()
    pred = cv2.cvtColor(pred,cv2.COLOR_RGB2BGR)
    
    cv2.imshow('Cartoonizer - WebCam [Press \'Q\' To Exit]', pred)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        gc.collect()
        torch.cuda.empty_cache()
        break
cv2.destroyAllWindows()
cap.release()
print('Exit...')


# %%



