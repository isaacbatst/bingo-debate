"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, RotateCcw, Sparkles } from "lucide-react"
import { Copy, Check, Heart, Coffee } from "lucide-react"
import { FRASES } from "./data"

// Chaves para localStorage
const STORAGE_KEYS = {
  cartela: "debate-bingo-cartela",
  marcadas: "debate-bingo-marcadas",
  pontuacao: "debate-bingo-pontuacao",
  venceu: "debate-bingo-venceu",
}

// Salvar estado no localStorage
const salvarEstado = (cartela: string[], marcadas: boolean[], pontuacao: number, venceu: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEYS.cartela, JSON.stringify(cartela))
    localStorage.setItem(STORAGE_KEYS.marcadas, JSON.stringify(marcadas))
    localStorage.setItem(STORAGE_KEYS.pontuacao, pontuacao.toString())
    localStorage.setItem(STORAGE_KEYS.venceu, venceu.toString())
  } catch (error) {
    console.warn("Erro ao salvar no localStorage:", error)
  }
}

// Carregar estado do localStorage
const carregarEstado = () => {
  try {
    const cartelaStr = localStorage.getItem(STORAGE_KEYS.cartela)
    const marcadasStr = localStorage.getItem(STORAGE_KEYS.marcadas)
    const pontuacaoStr = localStorage.getItem(STORAGE_KEYS.pontuacao)
    const venceuStr = localStorage.getItem(STORAGE_KEYS.venceu)

    if (cartelaStr && marcadasStr && pontuacaoStr && venceuStr) {
      return {
        cartela: JSON.parse(cartelaStr),
        marcadas: JSON.parse(marcadasStr),
        pontuacao: Number.parseInt(pontuacaoStr),
        venceu: venceuStr === "true",
      }
    }
  } catch (error) {
    console.warn("Erro ao carregar do localStorage:", error)
  }
  return null
}

export default function DebateBingo() {
  const [cartela, setCartela] = useState<string[]>([])
  const [marcadas, setMarcadas] = useState<boolean[]>(Array(25).fill(false))
  const [venceu, setVenceu] = useState(false)
  const [pontuacao, setPontuacao] = useState(0)
  const [pixCopiado, setPixCopiado] = useState(false)

  // Gerar cartela aleatória
  const gerarCartela = () => {
    const frasesEmbaralhadas = [...FRASES].sort(() => Math.random() - 0.5)
    const novaCartela = frasesEmbaralhadas.slice(0, 25)
    const novasMarcadas = Array(25).fill(false)
    const novaPontuacao = 0
    const novoVenceu = false

    setCartela(novaCartela)
    setMarcadas(novasMarcadas)
    setVenceu(novoVenceu)
    setPontuacao(novaPontuacao)

    // Salvar no localStorage
    salvarEstado(novaCartela, novasMarcadas, novaPontuacao, novoVenceu)
  }

  // Adicione este estilo no início do componente, após os imports
  const styles = `
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  @media (max-width: 480px) {
    .line-clamp-3 {
      -webkit-line-clamp: 2;
    }
  }
`

  // Verificar vitória
  const verificarVitoria = (novasMarcadas: boolean[]) => {
    // Verificar linhas
    for (let i = 0; i < 5; i++) {
      if (novasMarcadas.slice(i * 5, i * 5 + 5).every(Boolean)) return true
    }

    // Verificar colunas
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every((row) => novasMarcadas[row * 5 + i])) return true
    }

    // Verificar diagonais
    if ([0, 6, 12, 18, 24].every((i) => novasMarcadas[i])) return true
    if ([4, 8, 12, 16, 20].every((i) => novasMarcadas[i])) return true

    // Verificar cartela cheia
    if (novasMarcadas.every(Boolean)) return true

    return false
  }

  // Marcar/desmarcar célula
  const toggleCelula = (index: number) => {
    if (venceu) return

    const novasMarcadas = [...marcadas]
    novasMarcadas[index] = !novasMarcadas[index]
    const novaPontuacao = novasMarcadas.filter(Boolean).length
    const novoVenceu = verificarVitoria(novasMarcadas)

    setMarcadas(novasMarcadas)
    setPontuacao(novaPontuacao)
    setVenceu(novoVenceu)

    // Salvar no localStorage
    salvarEstado(cartela, novasMarcadas, novaPontuacao, novoVenceu)
  }

  // Copiar PIX
  const copiarPix = async () => {
    const chavePix = "e4aef5ee-24fc-4591-b4d3-d31740464256" // Substitua pela sua chave PIX
    try {
      await navigator.clipboard.writeText(chavePix)
      setPixCopiado(true)
      setTimeout(() => setPixCopiado(false), 2000)
    } catch {
      // Fallback para dispositivos que não suportam clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = chavePix
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setPixCopiado(true)
      setTimeout(() => setPixCopiado(false), 2000)
    }
  }

  // Carregar estado inicial
  useEffect(() => {
    const estadoSalvo = carregarEstado()

    if (estadoSalvo) {
      // Carregar estado salvo
      setCartela(estadoSalvo.cartela)
      setMarcadas(estadoSalvo.marcadas)
      setPontuacao(estadoSalvo.pontuacao)
      setVenceu(estadoSalvo.venceu)
    } else {
      // Gerar nova cartela se não houver estado salvo
      gerarCartela()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-2 sm:p-4">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
            BINGO DO DEBATE
            <Sparkles className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Marque as frases conforme aparecem no debate!</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Badge variant="secondary" className="text-sm sm:text-lg px-2 sm:px-4 py-1 sm:py-2">
            Marcadas: {pontuacao}/25
          </Badge>
          <Button onClick={gerarCartela} variant="outline" className="gap-2 text-sm sm:text-base">
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            Nova Cartela
          </Button>
        </div>

        {/* Bingo Grid */}
        <Card className="mb-6 bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {cartela.map((frase, index) => (
                <button
                  key={index}
                  onClick={() => toggleCelula(index)}
                  className={`
                    aspect-square p-1 sm:p-2 rounded-md sm:rounded-lg border-2 transition-all duration-300 
                    text-[8px] xs:text-[9px] sm:text-xs font-medium
                    flex items-center justify-center text-center leading-tight
                    overflow-hidden relative group
                    ${
                      marcadas[index]
                        ? "bg-green-500 border-green-400 text-white shadow-lg transform scale-105"
                        : "bg-white/90 border-gray-300 text-gray-800 hover:bg-white hover:border-blue-400 hover:shadow-md"
                    }
                    ${venceu ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                  disabled={venceu}
                  title={frase} // Tooltip para ver frase completa
                >
                  <span className="line-clamp-3 sm:line-clamp-4 break-words hyphens-auto text-center w-full">
                    {frase}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vitória */}
        {venceu && (
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 animate-pulse">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8" />
                BINGO!
                <Trophy className="w-8 h-8" />
              </CardTitle>
              <div className="text-white text-lg">🎉 Parabéns! Você completou o bingo! 🎉</div>
              <div className="text-white/90">Pontuação final: {pontuacao}/25 células marcadas</div>
            </CardHeader>
          </Card>
        )}

        {/* Instruções */}
        <Card className="mt-6 bg-white/5 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center">Como Jogar</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-center space-y-2">
            <p>• Clique nas células quando ouvir as frases durante o debate</p>
            <p>• Vença completando uma linha, coluna, diagonal ou cartela inteira</p>
            <p>• Use o botão Nova Cartela para embaralhar as frases</p>
          </CardContent>
        </Card>

        {/* Componente de Doação */}
        <Card className="mt-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur border-pink-300/30">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2 text-lg sm:text-xl">
              <Heart className="w-5 h-5 text-pink-400" />
              Gostou do Bingo?
              <Coffee className="w-5 h-5 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300 text-sm sm:text-base">
              Se este bingo tornou seu debate mais divertido, considere fazer uma contribuição! ☕
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Sua doação ajuda a manter projetos como este funcionando 💜
            </p>

            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <p className="text-white text-sm mb-3 font-medium">Chave PIX:</p>
              <div className="flex items-center gap-2 bg-black/30 rounded-md p-3">
                <code className="text-green-400 text-xs sm:text-sm flex-1 break-all">e4aef5ee-24fc-4591-b4d3-d31740464256
                </code>
                <Button
                  onClick={copiarPix}
                  size="sm"
                  variant="outline"
                  className={`
                    transition-all duration-300 gap-1 text-xs
                    ${
                      pixCopiado
                        ? "bg-green-500 border-green-400 text-white"
                        : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                    }
                  `}
                >
                  {pixCopiado ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-gray-400 text-xs">Qualquer valor é muito bem-vindo! 🙏</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
