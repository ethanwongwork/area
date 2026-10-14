// Renders SF Symbols to PNGs for local comparison only (Apple's licence: view, never ship or commit).
// swift apps/docs/scripts/sf-render.swift <outdir> <pointSize> name [name…]
// Writes <name>.png and, where it exists, <name>.fill.png (black on transparent, regular weight).
import AppKit
let args = CommandLine.arguments
let out = args[1], size = CGFloat(Double(args[2]) ?? 40)
for name in args.dropFirst(3) {
  for n in [name, name + ".fill"] {
    guard let base = NSImage(systemSymbolName: n, accessibilityDescription: nil) else { continue }
    let cfg = NSImage.SymbolConfiguration(pointSize: size, weight: .regular).applying(.init(paletteColors: [.black]))
    guard let img = base.withSymbolConfiguration(cfg) else { continue }
    let px = Int(size * 1.6)
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: px, pixelsHigh: px, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    let s = img.size, r = NSRect(x: (CGFloat(px) - s.width) / 2, y: (CGFloat(px) - s.height) / 2, width: s.width, height: s.height)
    img.draw(in: r)
    NSGraphicsContext.restoreGraphicsState()
    try? rep.representation(using: .png, properties: [:])?.write(to: URL(fileURLWithPath: "\(out)/\(n).png"))
  }
}
