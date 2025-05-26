好的，这是您提供的关于 Gemini TTS API 的文本内容，已转换为 Markdown 格式：

-----

# 语音生成 (文本转语音)

Gemini API 可以使用原生的文本转语音 (TTS) 功能，将文本输入转换为单人或多人的音频。文本转语音 (TTS) 生成是**可控的**，这意味着您可以使用自然语言来构建交互，并指导音频的**风格**、**口音**、**语速**和**音调**。

TTS 功能不同于通过 **Live API** 提供的语音生成，后者专为交互式、非结构化音频以及多模态输入和输出而设计。虽然 Live API 在动态对话上下文中表现出色，但通过 Gemini API 实现的 TTS 更适用于需要精确文本朗读并对风格和声音进行精细控制的场景，例如播客或有声读物的生成。

本指南将向您展示如何从文本生成单人和多人音频。

**预览 (Preview):** 原生文本转语音 (TTS) 功能目前处于**预览**阶段。

## 开始之前

确保您正在使用以下支持的模型版本之一来生成文本转语音音频。在开始构建之前，您可能还会发现在 AI Studio 中测试 Gemini 2.5 TTS 模型会很有帮助：

  * `gemini-2.5-pro-preview-tts` ([在 AI Studio 中尝试](https://aistudio.google.com/))
  * `gemini-2.5-flash-preview-tts` ([在 AI Studio 中尝试](https://aistudio.google.com/))

## 单人文本转语音

要将文本转换为单人音频，请将响应模态 (response modality) 设置为 `"audio"`，并传递一个设置了 `VoiceConfig` 的 `SpeechConfig` 对象。您需要从预构建的[输出声音](https://www.google.com/search?q=%23voice-options)中选择一个声音名称。

此示例将模型输出的音频保存在一个 wave 文件中：

\<details\>\<summary\>Python\</summary\>

```python
# Python code for single-speaker TTS would go here
# (Not provided in the original text for direct conversion)
```

\</details\>

\<details\>\<summary\>JavaScript\</summary\>

```javascript
import { GoogleGenAI } from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
   filename,
   pcmData,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });
      writer.on('finish', resolve);
      writer.on('error', reject);
      writer.write(pcmData);
      writer.end();
   });
}

async function main() {
   // Make sure to set your GEMINI_API_KEY environment variable
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: 'Say cheerfully: Have a wonderful day!' }] }],
      config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
               },
            },
      },
   });

   const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   const audioBuffer = Buffer.from(data, 'base64');
   const fileName = 'out.wav';
   await saveWaveFile(fileName, audioBuffer);
   console.log(`Audio saved to ${fileName}`);
}

await main();
```

\</details\>

## 多人文本转语音

对于多人音频，您需要一个 `MultiSpeakerVoiceConfig` 对象，并将每个发言者（最多 2 位）配置为 `SpeakerVoiceConfig`。您需要使用与**提示 (prompt)** 中使用的相同名称来定义每个 `speaker`：

\<details\>\<summary\>Python\</summary\>

```python
# Python code for multi-speaker TTS would go here
# (Not provided in the original text for direct conversion)
```

\</details\>

\<details\>\<summary\>JavaScript\</summary\>

```javascript
import { GoogleGenAI } from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
   filename,
   pcmData,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });
      writer.on('finish', resolve);
      writer.on('error', reject);
      writer.write(pcmData);
      writer.end();
   });
}

async function main() {
   // Make sure to set your GEMINI_API_KEY environment variable
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

   const prompt = `TTS the following conversation between Joe and Jane:
         Joe: How's it going today Jane?
         Jane: Not too bad, how about you?`;

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               multiSpeakerVoiceConfig: {
                  speakerVoiceConfigs: [
                        {
                           speaker: 'Joe',
                           voiceConfig: {
                              prebuiltVoiceConfig: { voiceName: 'Kore' }
                           }
                        },
                        {
                           speaker: 'Jane',
                           voiceConfig: {
                              prebuiltVoiceConfig: { voiceName: 'Puck' }
                           }
                        }
                  ]
               }
            }
      }
   });

   const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   const audioBuffer = Buffer.from(data, 'base64');
   const fileName = 'out.wav';
   await saveWaveFile(fileName, audioBuffer);
   console.log(`Audio saved to ${fileName}`);
}

await main();
```

\</details\>

## 流式传输 (Streaming)

您还可以使用流式传输来获取模型的输出音频，而不是像[单人](https://www.google.com/search?q=%23single-speaker-text-to-speech)和[多人](https://www.google.com/search?q=%23multi-speaker-text-to-speech)示例中那样保存到 wave 文件。

流式传输会在响应生成时返回部分响应，从而创建更流畅的响应。一旦响应开始，音频将自动开始播放。

\<details\>\<summary\>Python\</summary\>

```python
from google import genai
from google.genai import types
import pyaudio # 您需要安装 PyAudio

# Make sure to set your GEMINI_API_KEY environment variable
client = genai.Client(api_key="GEMINI_API_KEY")

# ... (Assume 'response' is the streaming response object)

# PyAudio configuration (adjust as needed)
FORMAT = pyaudio.paInt16 # Assuming 16-bit PCM
CHANNELS = 1
RECEIVE_SAMPLE_RATE = 24000 # Gemini TTS output rate

pya = pyaudio.PyAudio()

stream = pya.open(
         format=FORMAT,
         channels=CHANNELS,
         rate=RECEIVE_SAMPLE_RATE,
         output=True)

def play_audio(chunks):
   """Plays audio chunks received from the stream."""
   # chunk: Blob # Type hint
   for chunk in chunks:
      stream.write(chunk.data)

# Example usage (assuming 'response' is an iterable stream)
# play_audio(response)

# Remember to close the stream and PyAudio when done
# stream.stop_stream()
# stream.close()
# pya.terminate()
```

\</details\>

## 使用提示控制语音风格

您可以使用自然语言提示来控制单人和多人 TTS 的**风格**、**音调**、**口音**和**语速**。例如，在单人提示中，您可以说：

> 用阴森的耳语说：
> "拇指刺痛预兆生...
> 邪恶之物将降临"

在多人提示中，向模型提供每个发言者的姓名和相应的文本。您还可以为每个发言者单独提供指导：

> 让 Speaker1 听起来疲倦而无聊，让 Speaker2 听起来兴奋而快乐：
>
> Speaker1: 那么... 今天的议程是什么？
> Speaker2: 你绝对猜不到！

尝试使用与您想要传达的风格或情感相对应的[声音选项](https://www.google.com/search?q=%23voice-options)，以进一步强调它。例如，在前面的提示中，**Enceladus** 的气息声可能会强调“疲倦”和“无聊”，而 **Puck** 的乐观语气可以补充“兴奋”和“快乐”。

## 生成要转换为音频的提示

TTS 模型只输出音频，但您可以使用[其他模型](https://ai.google.dev/models/gemini)先生成文本，然后将该文本传递给 TTS 模型进行朗读。

\<details\>\<summary\>Python\</summary\>

```python
from google import genai
from google.genai import types

# Make sure to set your GEMINI_API_KEY environment variable
client = genai.Client(api_key="GEMINI_API_KEY")

transcript = client.models.generate_content(
   model="gemini-2.0-flash", # Using a text-generation model
   contents="""Generate a short transcript around 100 words that reads
            like it was clipped from a podcast by excited herpetologists.
            The hosts names are Dr. Anya and Liam.""").text

print(f"Generated Transcript:\n{transcript}\n")

response = client.models.generate_content(
   model="gemini-2.5-flash-preview-tts", # Using the TTS model
   contents=transcript,
   config=types.GenerateContentConfig(
      response_modalities=["AUDIO"],
      speech_config=types.SpeechConfig(
         multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
            speaker_voice_configs=[
               types.SpeakerVoiceConfig(
                  speaker='Dr. Anya',
                  voice_config=types.VoiceConfig(
                     prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Kore',
                     )
                  )
               ),
               types.SpeakerVoiceConfig(
                  speaker='Liam',
                  voice_config=types.VoiceConfig(
                     prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name='Puck',
                     )
                  )
               ),
            ]
         )
      )
   ))

# ... 这里的代码可以用于流式传输或保存输出音频 ...
# Example: Save to file (requires a function like save_wave_file)
# audio_data = response.candidates[0].content.parts[0].blob.data
# save_wave_file("podcast_clip.wav", audio_data)
# print("Podcast clip saved.")
```

\</details\>

## 技术细节

### 上下文窗口

TTS 会话的[上下文窗口](https://www.google.com/search?q=https://ai.google.dev/gemini-api/docs/context-window)限制为 **32k Token**。

### \<a name="voice-options"\>\</a\>声音选项

TTS 模型在 `voice_name` 字段中支持以下 30 种声音选项：

  * **Zephyr** -- 明亮 (Bright)
  * **Puck** -- 乐观 (Upbeat)
  * **Charon** -- 信息丰富 (Informative)
  * **Kore** -- 坚定 (Firm)
  * **Fenrir** -- 易激动 (Excitable)
  * **Leda** -- 年轻 (Youthful)
  * **Orus** -- 坚定 (Firm)
  * **Aoede** -- 轻快 (Breezy)
  * **Callirhoe** -- 随和 (Easy-going)
  * **Autonoe** -- 明亮 (Bright)
  * **Enceladus** -- 带气息 (Breathy)
  * **Iapetus** -- 清晰 (Clear)
  * **Umbriel** -- 随和 (Easy-going)
  * **Algieba** -- 流畅 (Smooth)
  * **Despina** -- 流畅 (Smooth)
  * **Erinome** -- 清晰 (Clear)
  * **Algenib** -- 沙哑 (Gravelly)
  * **Rasalgethi** -- 信息丰富 (Informative)
  * **Laomedeia** -- 乐观 (Upbeat)
  * **Achernar** -- 柔和 (Soft)
  * **Alnilam** -- 坚定 (Firm)
  * **Schedar** -- 平稳 (Even)
  * **Gacrux** -- 成熟 (Mature)
  * **Pulcherrima** -- 直率 (Forward)
  * **Achird** -- 友好 (Friendly)
  * **Zubenelgenubi** -- 休闲 (Casual)
  * **Vindemiatrix** -- 温柔 (Gentle)
  * **Sadachbia** -- 活泼 (Lively)
  * **Sadaltager** -- 知识渊博 (Knowledgeable)
  * **Sulafar** -- 温暖 (Warm)

您可以在 [AI Studio](https://aistudio.google.com/) 中听到所有声音选项。

### 支持的语言

TTS 模型会自动检测输入语言。它们支持以下 24 种语言：

| 语言 | BCP-47 代码 | 语言 | BCP-47 代码 |
| :--- | :--- | :--- | :--- |
| 阿拉伯语 (埃及) | `ar-EG` | 德语 (德国) | `de-DE` |
| 英语 (美国) | `en-US` | 西班牙语 (美国) | `es-US` |
| 法语 (法国) | `fr-FR` | 印地语 (印度) | `hi-IN` |
| 印度尼西亚语 | `id-ID` | 意大利语 (意大利) | `it-IT` |
| 日语 (日本) | `ja-JP` | 韩语 (韩国) | `ko-KR` |
| 葡萄牙语 (巴西) | `pt-BR` | 俄语 (俄罗斯) | `ru-RU` |
| 荷兰语 (荷兰) | `nl-NL` | 波兰语 (波兰) | `pl-PL` |
| 泰语 (泰国) | `th-TH` | 土耳其语 (土耳其) | `tr-TR` |
| 越南语 (越南) | `vi-VN` | 罗马尼亚语 (罗马尼亚) | `ro-RO` |
| 乌克兰语 (乌克兰) | `uk-UA` | 孟加拉语 (孟加拉国) | `bn-BD` |
| 英语 (印度) | `en-IN` & `hi-IN` 捆绑 | 马拉地语 (印度) | `mr-IN` |
| 泰米尔语 (印度) | `ta-IN` | 泰卢固语 (印度) | `te-IN` |

### 支持的模型

| 模型 | 单人 | 多人 |
| :--- | :---: | :---: |
| Gemini 2.5 Flash Preview TTS | ✔️ | ✔️ |
| Gemini 2.5 Pro Preview TTS | ✔️ | ✔️ |

-----