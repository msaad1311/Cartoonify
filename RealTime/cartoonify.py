
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torch.nn.functional as F

from utils.model_retrival import get_model
from models.generator import Generator

import numpy as np
import gc
import cv2
import matplotlib.pyplot as plt
import os
import time


get_model()

device = 'cuda' if torch.cuda.is_available() else  'cpu'
print(device)


model_path = r'models/trained_netG.pth'
generator = Generator().to(device)

generator.load_state_dict(torch.load(model_path,map_location=torch.device(device)))



preprocess = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

inv_normalize = transforms.Normalize(
    mean=[-0.485/0.229, -0.456/0.224, -0.406/0.255],
    std=[1/0.229, 1/0.224, 1/0.255]
)



print('Init WebCam...')
cap = cv2.VideoCapture(1)
size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
        int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))

fourcc = cv2.VideoWriter_fourcc(*'MP4V')
out = cv2.VideoWriter('output.mp4', fourcc, 15, size)

t_end = time.time() + 40

print('Start cartoonifying...')
i = 0
while(i<15):
    
    ret, frame_np = cap.read()
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
    pred_normalized = (pred - np.min(pred))/np.ptp(pred)
    print(pred_normalized.min(),pred_normalized.max())
    pred_resized = cv2.resize(pred_normalized,size,cv2.INTER_AREA)
    pred_resized = cv2.cvtColor(pred_resized,cv2.COLOR_BGR2RGB)
    # pred = cv2.flip(pred,0)
    out.write(np.uint8(pred_resized*255))
    cv2.imshow('Cartoonizer - WebCam [Press \'Q\' To Exit]', pred_resized)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        gc.collect()
        torch.cuda.empty_cache()
        break
    i+=1
cv2.destroyAllWindows()
out.release()
cap.release()
print('Exit...')


